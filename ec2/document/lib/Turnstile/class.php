<?php

declare(strict_types=1);

class Turnstile
{
    static private function validate(string $code): bool
    {
        if ($code) {
            $data = Secret::get("/turnstile/credentials.json");

            $curl = curl_init();
            curl_setopt($curl, CURLOPT_URL, "https://challenges.cloudflare.com/turnstile/v0/siteverify?secret=" . $data["secret"] . "&response=" . $code);
            curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
            curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($curl, CURLOPT_TIMEOUT, 5);
            $json = curl_exec($curl);
            curl_close($curl);

            $response = json_decode($json, true);

            if ($response && ($response["success"] ?? null)) {
                return true;
            }
        }

        return false;
    }

    static public function check(): null|bool
    {
        $code = $_POST["turnstile"] ?? null;

        if (PHP_SESSION_NONE === session_status()) {
            session_start();
        }

        $result = null;

        if (null !== $code) {
            if ($result = self::validate($code)) {
                $_SESSION["turnstile"] = [
                    "expires_at" => (600 + $_SERVER["REQUEST_TIME"]),
                ];
            }
        }

        return (true !== $result && 3 === _REQUEST_ && is_int($_SESSION["turnstile"]["expires_at"] ?? null)) ? true : $result;
    }
}
