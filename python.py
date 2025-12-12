# agent.py
"""
Safe TestAgent prototype
- Runs only user-approved commands inside a Docker container.
- Disables network inside container, sets CPU/memory caps, and enforces timeout.
- Collects stdout/stderr, basic metadata, packages into tar.gz.
- Optionally uploads to a server endpoint (simulated).
"""

import subprocess, json, tempfile, os, tarfile, time, uuid, argparse, sys
from pathlib import Path
import requests  # optional: only used if --upload is provided

# --------- Config / CLI ----------
parser = argparse.ArgumentParser(description="Safe TestAgent prototype")
parser.add_argument("--commands-file", help="Path to a JSON file with safe commands", required=False)
parser.add_argument("--image", default="python:3.11-slim", help="Sandbox image")
parser.add_argument("--cpus", default="0.5", help="CPU quota (e.g. 0.5)")
parser.add_argument("--mem", default="256m", help="Memory limit (e.g. 256m)")
parser.add_argument("--timeout", type=int, default=60, help="Per-command timeout seconds")
parser.add_argument("--upload-url", help="Optional: HTTPS endpoint to upload report (must be trusted)")
args = parser.parse_args()

# Default demo commands (non-destructive). Users MUST edit before running in real env.
DEFAULT_COMMANDS = [
    "python -c 'import platform,sys; print(\"functional-check: python\", platform.python_version())'",
    "python -c 'print(\"list-cwd-files:\"); import os; print(os.listdir(\"/workspace\")[:20])'"
]

# Load commands from file if provided
if args.commands_file:
    try:
        with open(args.commands_file, "r") as f:
            data = json.load(f)
            COMMANDS = data.get("commands", DEFAULT_COMMANDS)
    except Exception as e:
        print("Failed to read commands file:", e, file=sys.stderr)
        COMMANDS = DEFAULT_COMMANDS
else:
    COMMANDS = DEFAULT_COMMANDS

# Safety: do not allow dangerous flags here; network is disabled below
TEST_ID = str(uuid.uuid4())
IMAGE = args.image
CPU_LIMIT = args.cpus
MEM_LIMIT = args.mem
TIMEOUT = args.timeout

# Create temporary workspace to stage artifacts
tmpdir = Path(tempfile.mkdtemp(prefix="testagent_"))
artifact_dir = tmpdir / "artifacts"
artifact_dir.mkdir(parents=True, exist_ok=True)

results = []
start_all = time.time()
# Emscripten / browser-safe check
if sys.platform == "emscripten":
    print("Running in WASM sandbox: using mock command executor.")
    # Simulated results (Docker not available)
    results = []
    for i, cmd in enumerate(COMMANDS):
        results.append({
            "index": i,
            "cmd": cmd,
            "rc": 0,
            "out": f"[mocked-output] {cmd}",
            "err": "",
            "duration_seconds": 0.01
        })
    metadata = {
        "test_id": TEST_ID,
        "timestamp_utc": time.time(),
        "host_platform": sys.platform,
        "python_version": sys.version.split()[0],
        "commands_count": len(results),
        "resource_limits": {"cpus": CPU_LIMIT, "memory": MEM_LIMIT, "per_command_timeout": TIMEOUT}
    }
    report = {"metadata": metadata, "results": results}
    report_path = tmpdir / "report.json"
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    archive_path = Path.cwd() / f"testagent_report_{TEST_ID}.tar.gz"
    with tarfile.open(archive_path, "w:gz") as tar:
        tar.add(report_path, arcname="report.json")
    print("[WASM] Mock report generated at:", archive_path)
    print(json.dumps(results[:3], indent=2))
    print("Done.")
    sys.exit(0)

for i, cmd in enumerate(COMMANDS):
    start = time.time()
    full_cmd = [
        "docker", "run", "--rm",
        "--cpus", CPU_LIMIT,
        "--memory", MEM_LIMIT,
        "--network", "none",
        "--volume", f"{artifact_dir.resolve()}:/workspace:ro",
        IMAGE,
        "bash", "-lc", cmd
    ]
    try:
        proc = subprocess.run(full_cmd, capture_output=True, text=True, timeout=TIMEOUT)
        out = proc.stdout
        err = proc.stderr
        rc = proc.returncode
    except subprocess.TimeoutExpired:
        out, err, rc = "", "timeout", 124
    duration = time.time() - start

    def safe_truncate(s, n=2000):
        if not s:
            return ""
        if len(s) <= n:
            return s
        return s[:1000] + "\n\n...TRUNCATED...\n\n" + s[-900:]

    results.append({
        "index": i,
        "cmd": cmd,
        "rc": rc,
        "out": safe_truncate(out),
        "err": safe_truncate(err),
        "duration_seconds": round(duration, 3)
    })

metadata = {
    "test_id": TEST_ID,
    "timestamp_utc": time.time(),
    "host_platform": sys.platform,
    "python_version": sys.version.split()[0],
    "commands_count": len(results),
    "resource_limits": {"cpus": CPU_LIMIT, "memory": MEM_LIMIT, "per_command_timeout": TIMEOUT}
}

report = {"metadata": metadata, "results": results}

report_path = tmpdir / "report.json"
with open(report_path, "w") as f:
    json.dump(report, f, indent=2)

archive_path = Path.cwd() / f"testagent_report_{TEST_ID}.tar.gz"
with tarfile.open(archive_path, "w:gz") as tar:
    tar.add(report_path, arcname="report.json")

print("Report generated at:", archive_path)
print("Summary (first 3 results):")
print(json.dumps(results[:3], indent=2))

if args.upload_url:
    try:
        files = {"file": (archive_path.name, open(archive_path, "rb"))}
        print("Uploading to", args.upload_url)
        resp = requests.post(args.upload_url, files=files, timeout=30)
        print("Upload response:", resp.status_code, resp.text[:400])
    except Exception as e:
        print("Upload failed:", e, file=sys.stderr)

print("Done. Temporary dir:", tmpdir)
