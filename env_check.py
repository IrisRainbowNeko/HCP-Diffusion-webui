import subprocess
import os
import sys
import importlib.util

python = sys.executable
hcpinit = os.path.join(os.path.dirname(sys.executable), 'hcpinit')

def run(command, desc=None, errdesc=None, custom_env=None, live=False):
    if desc is not None:
        print(desc)

    if live:
        result = subprocess.run(command, shell=True, env=os.environ if custom_env is None else custom_env)
        if result.returncode != 0:
            raise RuntimeError(f"""{errdesc or 'Error running command'}.
Command: {command}
Error code: {result.returncode}""")

        return ""

    result = subprocess.run(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True, env=os.environ if custom_env is None else custom_env)

    if result.returncode != 0:

        message = f"""{errdesc or 'Error running command'}.
Command: {command}
Error code: {result.returncode}
stdout: {result.stdout.decode(encoding="utf8", errors="ignore") if len(result.stdout)>0 else '<empty>'}
stderr: {result.stderr.decode(encoding="utf8", errors="ignore") if len(result.stderr)>0 else '<empty>'}
"""
        raise RuntimeError(message)

    return result.stdout.decode(encoding="utf8", errors="ignore")

def is_installed(package):
    try:
        spec = importlib.util.find_spec(package)
    except ModuleNotFoundError:
        return False

    return spec is not None

torch_command = 'pip install torch==2.0.0+cu117 torchvision==0.15.1+cu117 torchaudio==2.0.1 --index-url https://download.pytorch.org/whl/cu117'

def prepare_environment():

    if not is_installed("torch") or not is_installed("torchvision"):
        run(f'{python} -m {torch_command}', 'Install pytorch', live=True)

    if not is_installed("flask"):
        run(f'{python} -m pip install flask', live=True)

    if not is_installed("accelerate"):
        if os.path.exists('HCP-Diffusion/setup.py'):
            os.chdir('HCP-Diffusion')
            run(f'{python} -m pip install -e .', 'Install HCP-Diffusion', live=True)
            os.chdir('../')
        else:
            run(f'{python} -m pip install hcpdiff', live=True)

    if not os.path.exists('cfgs/'):
        run(hcpinit, live=True)


if __name__ == '__main__':
    prepare_environment()