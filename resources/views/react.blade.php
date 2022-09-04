<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <title>LINEBOT ADDONS</title>
        <link rel="stylesheet" href="{{ mix('css/app.css') }}?ver={{ $appVer }}" type="text/css" />
        <style type="text/css">
            /* #__vconsole {
                display: none;
            } */
            @font-face {
                font-family: 'Honoka Mincho';
                font-style: normal;
                font-weight: normal;
                src: url('{{ $assetUrl }}/fonts/honoka-mincho.ttf');
            }
        </style>
        <script type="text/javascript" src="{{ $assetUrl }}/js/vconsole.min.js"></script>
        <script type="text/javascript">
            var vConsole = new VConsole();
            window.appUrl = '{{ $appUrl }}';
            window.assetUrl = function(path, withoutVersion) {
                var url = '{{ $assetUrl }}' + path;
                if (withoutVersion !== true) {
                    url += '?ver={{ $appVer }}';
                }
                return url;
            }
            window.useMockUser = '{{ $useMockUser }}';
            window.oaUrl = '{{ $oaUrl }}';
            window.liffId = '{{ $liffId }}';
            window.liffUrl = '{{ $liffUrl }}';
        </script>
    </head>
    <body>
        <div id="app"></div>
        <div id="my-modal"></div>
        <script src="{{ mix('js/app.js') }}?ver={{ $appVer }}"></script>
    </body>
</html>
