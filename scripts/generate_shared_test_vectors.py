#!/usr/bin/env python3
"""
Generatore DETERMINISTICO di Vettori di Test Pubblici per ABBO APS NFC.
Utilizza una chiave fittizia di test deterministica (k2099-01-test).
Genera vettori per validazione incrociata tra Python cryptography e Browser Web Crypto API.
"""

import base64
import hashlib
import json
from pathlib import Path

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.asymmetric.utils import decode_dss_signature, encode_dss_signature


def b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode("ascii")


def b64url_decode(s: str) -> bytes:
    padding = "=" * ((4 - len(s) % 4) % 4)
    return base64.urlsafe_b64decode(s + padding)


def der_to_raw_rs(der_bytes: bytes) -> bytes:
    r, s = decode_dss_signature(der_bytes)
    return r.to_bytes(32, byteorder="big") + s.to_bytes(32, byteorder="big")


def canonical_json_bytes(obj: dict) -> bytes:
    return json.dumps(obj, sort_keys=True, separators=(",", ":"), ensure_ascii=False).encode("utf-8")


def public_key_to_jwk(pub_key: ec.EllipticCurvePublicKey) -> dict:
    numbers = pub_key.public_numbers()
    x_bytes = numbers.x.to_bytes(32, byteorder="big")
    y_bytes = numbers.y.to_bytes(32, byteorder="big")
    return {
        "kty": "EC",
        "crv": "P-256",
        "x": b64url_encode(x_bytes),
        "y": b64url_encode(y_bytes),
        "ext": True,
        "key_ops": ["verify"],
    }


def main():
    repo_root = Path(__file__).resolve().parent.parent
    valid_dir = repo_root / "shared-public-test-vectors" / "valid"
    invalid_dir = repo_root / "shared-public-test-vectors" / "invalid"

    valid_dir.mkdir(parents=True, exist_ok=True)
    invalid_dir.mkdir(parents=True, exist_ok=True)

    # 1. Genera una chiave P-256 deterministica da uno dsa scalar fisso per test
    # (Scalar d fiduciario di test = 0x0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF)
    private_value = int("0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF0123456789ABCDEF", 16)
    private_key = ec.derive_private_key(private_value, ec.SECP256R1())
    public_key = private_key.public_key()
    kid = "k2099-01-test"

    jwk = public_key_to_jwk(public_key)

    test_keyring = {
        "schemaVersion": 1,
        "keys": [
            {
                "kid": kid,
                "alg": "ES256",
                "status": "active",
                "createdAt": "2026-07-28T13:00:00Z",
                "jwk": jwk,
            }
        ],
    }

    # 2. Manifesto dell'edizione di prova
    edition_id = "ed_TEST1234567890ABC"
    manifest_payload = {
        "v": 1,
        "t": "edition",
        "iss": "ABBO APS",
        "aud": "ABBO-PRODUCT-VERIFY-V1",
        "e": edition_id,
        "r": 1,
        "code": "TEST-POSTER-2026",
        "title": "Poster Test ABBO APS — Edizione 2026",
        "description": "Edizione di prova per vettori di test crittografici.",
        "n": 200,
        "releaseDate": "2026-09-01",
        "image": {
            "path": f"assets/products/{edition_id}/cover.webp",
            "sha256": b64url_encode(hashlib.sha256(b"dummy_image_bytes").digest()),
            "alt": "Immagine di test",
        },
        "physicalSerialRequired": True,
        "createdAt": "2026-07-28T13:00:00Z",
    }

    manifest_bytes = canonical_json_bytes(manifest_payload)
    manifest_payload_b64 = b64url_encode(manifest_bytes)
    # Hash h dell'item corrisponde a SHA-256 dei byte del payload decodificato
    manifest_h = b64url_encode(hashlib.sha256(manifest_bytes).digest())

    manifest_signed_str = f"ABBO-EDITION-1.{kid}.{manifest_payload_b64}"
    der_sig_m = private_key.sign(manifest_signed_str.encode("utf-8"), ec.ECDSA(hashes.SHA256()))
    raw_sig_m = der_to_raw_rs(der_sig_m)
    manifest_sig_b64 = b64url_encode(raw_sig_m)

    manifest_envelope = {
        "format": "ABBO-EDITION-1",
        "kid": kid,
        "payload": manifest_payload_b64,
        "signature": manifest_sig_b64,
    }

    def create_item_token(serial: int, item_id: str, pairing_code: str | None = None) -> Tuple[str, dict]:
        payload = {
            "v": 1,
            "t": "p",
            "iss": "ABBO APS",
            "aud": "ABBO-PRODUCT-VERIFY-V1",
            "e": edition_id,
            "r": 1,
            "h": manifest_h,
            "s": serial,
            "n": 200,
            "i": item_id,
            "d": "2026-07-28",
        }
        if pairing_code:
            p_hash = hashlib.sha256(f"{edition_id}:{item_id}:{pairing_code}".encode("utf-8")).digest()
            payload["p"] = b64url_encode(p_hash)

        payload_bytes = canonical_json_bytes(payload)
        payload_b64 = b64url_encode(payload_bytes)

        signed_str = f"AB1.{kid}.{payload_b64}"
        der_s = private_key.sign(signed_str.encode("utf-8"), ec.ECDSA(hashes.SHA256()))
        raw_s = der_to_raw_rs(der_s)
        sig_b64 = b64url_encode(raw_s)

        token = f"AB1.{kid}.{payload_b64}.{sig_b64}"
        return token, payload

    # Vettori validi
    tok1, payload1 = create_item_token(20, "it_TESTITEM000000020")
    vec1 = {
        "metadata": {"name": "valid_normal_item", "description": "Token item valido per l'esemplare 20 di 200", "expected": "valid"},
        "token": tok1,
        "manifestEnvelope": manifest_envelope,
        "keyring": test_keyring,
    }
    with open(valid_dir / "01_valid_normal_item.json", "w", encoding="utf-8") as f:
        json.dump(vec1, f, indent=2)

    tok2, _ = create_item_token(1, "it_TESTITEM000000001")
    vec2 = {
        "metadata": {"name": "valid_serial_1", "description": "Primo esemplare della tiratura", "expected": "valid"},
        "token": tok2,
        "manifestEnvelope": manifest_envelope,
        "keyring": test_keyring,
    }
    with open(valid_dir / "02_valid_serial_1.json", "w", encoding="utf-8") as f:
        json.dump(vec2, f, indent=2)

    tok3, _ = create_item_token(200, "it_TESTITEM000000200")
    vec3 = {
        "metadata": {"name": "valid_serial_max", "description": "Ultimo esemplare della tiratura", "expected": "valid"},
        "token": tok3,
        "manifestEnvelope": manifest_envelope,
        "keyring": test_keyring,
    }
    with open(valid_dir / "03_valid_serial_max.json", "w", encoding="utf-8") as f:
        json.dump(vec3, f, indent=2)

    tok4, _ = create_item_token(20, "it_TESTITEM000000020", pairing_code="M7RQ-8K4P-2TXD")
    vec4 = {
        "metadata": {"name": "valid_with_pairing", "description": "Token valido con codice fisico di abbinamento", "expected": "valid", "pairingCode": "M7RQ-8K4P-2TXD"},
        "token": tok4,
        "manifestEnvelope": manifest_envelope,
        "keyring": test_keyring,
    }
    with open(valid_dir / "04_valid_with_pairing.json", "w", encoding="utf-8") as f:
        json.dump(vec4, f, indent=2)

    # Vettori invalidi
    t1_parts = tok1.split(".")
    payload1_tampered = dict(payload1)
    payload1_tampered["s"] = 21
    tampered_p_b64 = b64url_encode(canonical_json_bytes(payload1_tampered))
    tok_tampered_p = f"AB1.{kid}.{tampered_p_b64}.{t1_parts[3]}"
    vec_i1 = {
        "metadata": {"name": "invalid_tampered_payload", "description": "Payload alterato dopo la firma (seriale 20 -> 21)", "expected": "invalid", "reason": "signature_mismatch"},
        "token": tok_tampered_p,
        "manifestEnvelope": manifest_envelope,
        "keyring": test_keyring,
    }
    with open(invalid_dir / "01_invalid_tampered_payload.json", "w", encoding="utf-8") as f:
        json.dump(vec_i1, f, indent=2)

    sig_chars = list(t1_parts[3])
    sig_chars[0] = "A" if sig_chars[0] != "A" else "B"
    tok_tampered_sig = f"AB1.{kid}.{t1_parts[2]}.{''.join(sig_chars)}"
    vec_i2 = {
        "metadata": {"name": "invalid_tampered_signature", "description": "Firma alterata di 1 carattere", "expected": "invalid", "reason": "signature_verification_failed"},
        "token": tok_tampered_sig,
        "manifestEnvelope": manifest_envelope,
        "keyring": test_keyring,
    }
    with open(invalid_dir / "02_invalid_tampered_signature.json", "w", encoding="utf-8") as f:
        json.dump(vec_i2, f, indent=2)

    print(f"✅ Vettori di test deterministici generati in {valid_dir} e {invalid_dir}")


if __name__ == "__main__":
    main()
