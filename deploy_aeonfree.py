"""
deploy_aeonfree.py
Automated FTP Deployment Script for AeonFree Hosting.
Uploads the production-built KEP QuantumVerse frontend directly to AeonFree's htdocs/ folder.
"""

import os
import sys
from ftplib import FTP, error_perm

FTP_HOST_DEFAULT = "ftpupload.net"
FTP_PORT = 21
DIST_DIR = os.path.join(os.path.dirname(__file__), "frontend", "dist")

def upload_directory(ftp: FTP, local_dir: str, remote_dir: str):
    print(f"[*] Switching to remote directory: {remote_dir}")
    try:
        ftp.cwd(remote_dir)
    except error_perm:
        print(f"[*] Creating remote directory: {remote_dir}")
        ftp.mkd(remote_dir)
        ftp.cwd(remote_dir)

    for item in os.listdir(local_dir):
        local_path = os.path.join(local_dir, item)
        if os.path.isfile(local_path):
            print(f"  -> Uploading: {item} ...", end=" ", flush=True)
            with open(local_path, "rb") as f:
                ftp.storbinary(f"STOR {item}", f)
            print("OK")
        elif os.path.isdir(local_path):
            new_remote = f"{remote_dir}/{item}"
            upload_directory(ftp, local_path, new_remote)
            ftp.cwd(remote_dir)

def main():
    print("=" * 60)
    print("  KEP QuantumVerse — AeonFree Automated Deployment Tool")
    print("=" * 60)

    if not os.path.exists(DIST_DIR):
        print(f"[!] Error: Build directory not found at {DIST_DIR}")
        print("    Please run 'npm run build' inside frontend/ first.")
        sys.exit(1)

    # Check for arguments or prompt
    if len(sys.argv) >= 3:
        username = sys.argv[1]
        password = sys.argv[2]
        ftp_host = sys.argv[3] if len(sys.argv) >= 4 else FTP_HOST_DEFAULT
        domain = sys.argv[4] if len(sys.argv) >= 5 else None
    else:
        ftp_host = input(f"Enter FTP Host [{FTP_HOST_DEFAULT}]: ").strip() or FTP_HOST_DEFAULT
        username = input("Enter AeonFree FTP Username (e.g., aeon_12345678): ").strip()
        import getpass
        password = getpass.getpass("Enter AeonFree FTP Password / Account Password: ").strip()
        domain = input("Enter your AeonFree Domain (e.g., yourname.aeonfree.com or yourname.hstn.me): ").strip()

    if not username or not password:
        print("[!] Error: Username and password are required.")
        sys.exit(1)

    print(f"\n[*] Connecting to {ftp_host}:{FTP_PORT} ...")
    try:
        ftp = FTP()
        ftp.connect(ftp_host, FTP_PORT, timeout=30)
        print("[*] Logging in ...")
        ftp.login(username, password)
        print("[+] Logged in successfully!")

        # AeonFree web root is inside /htdocs
        print("[*] Navigating to /htdocs ...")
        try:
            ftp.cwd("/htdocs")
        except error_perm:
            ftp.cwd("htdocs")

        print("[*] Starting file upload from frontend/dist ...")
        upload_directory(ftp, DIST_DIR, "/htdocs")

        ftp.quit()
        print("\n" + "=" * 60)
        print("  DEPLOYMENT SUCCESSFUL!")
        print("=" * 60)
        if domain:
            url = domain if domain.startswith("http") else f"http://{domain}"
            print(f"\nYour application is now live at: {url}\n")
        else:
            print("\nYour application is now live on your AeonFree domain!\n")
    except Exception as e:
        print(f"\n[!] FTP Deployment failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
