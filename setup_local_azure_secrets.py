import subprocess as sp
import json
import base64

set_context_command = "kubectl config use-context dev-gcp"


def get_secrets_name(application_name):
    return run_command(
        f"kubectl get azureapp -n teamforeldrepenger {application_name} -o go-template='{'{{.spec.secretName}}'}'"
    ).replace("'", "")


def get_secret_by_name(secret_name):
    secrets = run_command(f"kubectl get secret {secret_name} -n teamforeldrepenger -o json")
    return json.loads(secrets)["data"]


def get_secret_by_label(label_selector):
    secrets = run_command(f"kubectl get secrets {label_selector} -n teamforeldrepenger -o json")
    return json.loads(secrets)["items"][0]["data"]


def get_application_secrets(application_name):
    secret_name = get_secrets_name(application_name)
    secrets = run_command(f"kubectl get secret {secret_name} -n teamforeldrepenger -o json")
    return json.loads(secrets)["data"]


def run_command(command: str):
    return sp.run(command.split(" "), capture_output=True).stdout.decode("utf-8")


def read_existing_env(file_path):
    try:
        with open(file_path, "r") as env:
            env_vars = [line.split("=", 1) for line in env.read().splitlines() if line]
            return {key: value for key, value in env_vars}
    except FileNotFoundError:
        return {}


def base64_decode(value, url=False):
    if url:
        return base64.urlsafe_b64decode(str(value)).decode("utf-8")
    else:
        return base64.b64decode(str(value)).decode("utf-8")


def setup_server_secrets():

    env_file_path = "server/.env"

    print(f"Setting up secrets for {env_file_path}")

    idporten_secrets = get_secret_by_name("idporten-sso")
    print(idporten_secrets)
    tokenx_secrets = get_secret_by_label("-l app=ft-inntektsmelding-frontend")
    env_object = read_existing_env(env_file_path)

    env_object.update(
        {
            "IDPORTEN_WELL_KNOWN_URL": base64_decode(idporten_secrets["IDPORTEN_WELL_KNOWN_URL"], True),
            "IDPORTEN_CLIENT_ID": base64_decode(idporten_secrets["IDPORTEN_CLIENT_ID"], True),
            "IDPORTEN_JWKS_URI": base64_decode(idporten_secrets["IDPORTEN_JWKS_URI"], True),
            "IDPORTEN_ISSUER": base64_decode(idporten_secrets["IDPORTEN_ISSUER"], True),
            "IDPORTEN_AUDIENCE": base64_decode(idporten_secrets["IDPORTEN_AUDIENCE"], True),
            "TOKEN_X_ISSUER": base64_decode(tokenx_secrets["TOKEN_X_ISSUER"], True),
            "TOKEN_X_CLIENT_ID": base64_decode(tokenx_secrets["TOKEN_X_CLIENT_ID"], True),
            "TOKEN_X_TOKEN_ENDPOINT": base64_decode(tokenx_secrets["TOKEN_X_TOKEN_ENDPOINT"], True),
            "TOKEN_X_PRIVATE_JWK": f"\'{base64_decode(tokenx_secrets['TOKEN_X_PRIVATE_JWK'])}\'",
        }
    )

    with open(env_file_path, "w+") as env_file:
        env_file.writelines([f"{key}={value}\n" for key, value in env_object.items()])
        print(f"Successfully written new secrets to {env_file_path}")

# Setter riktig context for kubectl
run_command(set_context_command)

setup_server_secrets()
