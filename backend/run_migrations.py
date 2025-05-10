# team-project-2024849-sprinters/backend/run_migrations.py

import os
import sys
from alembic.config import Config as AlembicConfig
from alembic import command as alembic_command

# --- Crucial Import ---
# This tries to import your Flask 'app' instance.
# It assumes 'app' is defined in 'backend/__init__.py'.
# This import relies on PYTHONPATH being set correctly in Render
# (e.g., PYTHONPATH=/opt/render/project/src/) so that 'backend' is discoverable.
try:
    from backend import app
    print("Successfully imported 'app' from 'backend' package.")
except ImportError as e:
    print(f"Error: Could not import 'app' from 'backend'. Ensure PYTHONPATH is correct.")
    print(f"ImportError: {e}")
    print(f"Current sys.path: {sys.path}")
    print(f"Current working directory: {os.getcwd()}")
    # If 'backend' is the Root Directory and CWD, try importing from parent for 'backend' package
    # This is a fallback if the primary PYTHONPATH isn't making 'backend' globally importable
    # and Gunicorn/Flask CLI were having issues.
    # For this script, if CWD is 'backend/', then 'backend' is not directly importable as a package name.
    # We need to ensure the PARENT of 'backend/' is on sys.path.
    # The PYTHONPATH=/opt/render/project/src/ environment variable is supposed to handle this.
    # If it's not, we might need to adjust sys.path here, but that's a deeper issue.
    # For now, let's assume PYTHONPATH in Render env var works.
    exit(1) # Exit if we can't import the app, as Alembic env.py will likely need it.

def run_migrations_script():
    """
    Programmatically runs Alembic migrations.
    """
    print(f"--- Starting Migration Script ---")
    print(f"Current Working Directory: {os.getcwd()}")
    print(f"Python Executable: {sys.executable}")
    print(f"Python Version: {sys.version}")
    print(f"sys.path: {sys.path}")
    print(f"Environment Variables (selected):")
    print(f"  DATABASE_URL set: {'DATABASE_URL' in os.environ}")
    print(f"  SCHEMA set: {'SCHEMA' in os.environ}")
    print(f"  PYTHONPATH: {os.environ.get('PYTHONPATH')}")
    print(f"  FLASK_APP: {os.environ.get('FLASK_APP')}")


    # --- Path to alembic.ini ---
    # Assumes this script (run_migrations.py) is in the 'backend/' directory,
    # and the 'migrations/' directory (containing alembic.ini) is also in 'backend/'.
    # So, current_script_dir will be /path/to/backend/
    current_script_dir = os.path.dirname(os.path.abspath(__file__))
    # project_root_for_alembic should effectively be the 'backend' directory if CWD is 'backend'
    # and migrations folder is a subdirectory.
    # If CWD for the build command IS the 'backend' directory:
    alembic_ini_path = os.path.join(current_script_dir, "migrations", "alembic.ini")

    # A simpler relative path if CWD is already 'backend/'
    # alembic_ini_path = "migrations/alembic.ini"

    if not os.path.exists(alembic_ini_path):
        print(f"Error: alembic.ini not found at the expected path: {alembic_ini_path}")
        # Try an alternative common path if the above failed due to CWD assumptions
        alt_alembic_ini_path = os.path.join(os.getcwd(), "migrations", "alembic.ini")
        if os.path.exists(alt_alembic_ini_path):
            print(f"Found alembic.ini at alternative path: {alt_alembic_ini_path}")
            alembic_ini_path = alt_alembic_ini_path
        else:
            print(f"Error: alembic.ini also not found at {alt_alembic_ini_path}. Please check paths.")
            return False

    print(f"Using alembic.ini from resolved path: {os.path.abspath(alembic_ini_path)}")

    # --- Alembic Configuration ---
    alembic_cfg = AlembicConfig(alembic_ini_path)

    # Optional: Set script_location if alembic.ini doesn't specify it relative to itself correctly,
    # or if env.py needs it.
    # The 'script_location' in alembic.ini is usually relative (e.g., 'migrations' or 'backend/migrations').
    # If alembic.ini is IN 'migrations/', then script_location is often just '.' or the dir name itself.
    # If your alembic.ini has `script_location = migrations` and it's located at `backend/migrations/alembic.ini`,
    # it means Alembic will look for `backend/migrations/migrations/` which is wrong.
    # The script_location in alembic.ini should point to the directory containing env.py and versions/.
    # If alembic.ini is IN the migrations folder, script_location is often just 'migrations' if alembic is run from parent,
    # or '.' if alembic is run from within the migrations folder.
    #
    # Let's assume alembic.ini has `script_location = name_of_your_migrations_folder` (e.g., `migrations`)
    # and alembic.ini itself is INSIDE that folder.
    # Or, if alembic.ini is in `backend/` and `script_location = backend/migrations`.
    #
    # The Flask-Migrate default is that alembic.ini is in the 'migrations' folder,
    # and script_location in alembic.ini is the *name of the migrations folder itself*.
    # Example: if your migrations dir is `backend/migrations_folder_name`
    # then alembic.ini is in `backend/migrations_folder_name/alembic.ini`
    # and script_location in that ini is `migrations_folder_name`
    #
    # Our current assumption: `backend/migrations/alembic.ini` exists.
    # And `script_location` inside `alembic.ini` points to the directory containing `env.py`
    # relative to where alembic.ini is. Usually, this means `script_location` in `alembic.ini`
    # doesn't need changing if it's just the name of the folder itself, e.g., `migrations`.
    #
    # For clarity, let's set it programmatically to be the 'migrations' directory
    # that is a sibling to this script (or in the CWD).
    migrations_directory_path = os.path.join(current_script_dir, "migrations")
    if not os.path.isdir(migrations_directory_path):
        migrations_directory_path = os.path.join(os.getcwd(), "migrations") # Fallback
    print(f"Setting Alembic script_location to: {migrations_directory_path}")
    alembic_cfg.set_main_option("script_location", migrations_directory_path)


    # --- Run Migrations ---
    print("Attempting to run Alembic upgrade to 'head'...")
    try:
        # It's good practice to run DB operations within Flask's app context
        # if your models or extensions (like Flask-SQLAlchemy used in env.py) require it.
        with app.app_context():
            alembic_command.upgrade(alembic_cfg, "head")
        print("Alembic upgrade command successfully executed.")
        return True
    except Exception as e:
        print(f"Error occurred during Alembic upgrade: {e}")
        import traceback
        traceback.print_exc() # Print the full traceback for debugging
        return False

if __name__ == "__main__":
    print("--- run_migrations.py script invoked ---")
    success = run_migrations_script()
    if success:
        print("--- Migrations completed successfully ---")
        exit(0)
    else:
        print("--- Migrations failed ---")
        exit(1) # Exit with a non-zero code to indicate failure to the build system