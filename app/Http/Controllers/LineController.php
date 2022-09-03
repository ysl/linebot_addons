<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Controllers\LineCustomMessageBuilder;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Exception\ConnectException;

class LineController extends Controller
{
    private $bot;

    const HTTP_TIMEOUT = 30;

    const API_GET_PROFILE = '/v2/profile';

    public function __construct()
    {
        $httpClient = new \LINE\LINEBot\HTTPClient\CurlHTTPClient(config('services.line.channelAccessToken'));
        $this->bot = new \LINE\LINEBot($httpClient, ['channelSecret' => 'services.line.channelSecret']);
    }

    public function pushMessage($lineId, $json_messages) {
        $msg = new LineCustomMessageBuilder($json_messages);
        $res = $this->bot->pushMessage($lineId, $msg);

        if ($res->isSucceeded()) {
            Log::info("pushMessage() success: line_id=[{$lineId}]");
            return true;
        } else {
            $httpStatusCode = $res->getHTTPStatus();
            $errorMessage = $res->getRawBody();
            Log::error("pushMessage() error:  msg=[{$errorMessage}] httpStatus=[({$httpStatusCode})] line_id=[{$lineId}]");
            return false;
        }
    }

    public function getProfile($accessToken)
    {
        $headers = [
            'Authorization' => "Bearer {$accessToken}",
        ];

        $client = new Client([
            'base_uri' => 'https://api.line.me',
            'timeout'  => self::HTTP_TIMEOUT,
        ]);
        try {
            $response = $client->request('GET', self::API_GET_PROFILE, [
                'headers' => $headers,
            ]);
            $code = $response->getStatusCode();
            $body = $response->getBody();
            $data = json_decode($body, true);
            return $data;
        } catch (RequestException $e) {
            if ($e->hasResponse()) {
                $res = $e->getResponse();
                $code = $res->getStatusCode();
                $body = $res->getBody();
                Log::error("Request [".self::API_GET_PROFILE."] fail, http_code=[{$code}], reason: {$body}");
            }
            return null;
        } catch (ConnectException $e) {
            Log::error("Request [".self::API_GET_PROFILE."] fail, http connection error.");
            return null;
        }
    }
}
