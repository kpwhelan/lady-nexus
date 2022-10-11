<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Lady Nexus</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">

         <link href="{{ asset('css/app.css') }}" rel="stylesheet">

    </head>
    <body class="antialiased bg-slate-200" style="-webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; --tw-bg-opacity: 1; background-color: rgb(226 232 240 / var(--tw-bg-opacity));">
        <img src={{asset('images/LadyNexus-logo.png')}} class="block h-52 w-52 rounded-full mx-auto mt-4" style="display: block; height:13rem; width:13rem; border-radius: 9999px; margin-left:auto; margin-right:auto; margin-top:1rem" />
        <div class="mx-auto bg-white p-3 mt-4 w-fit" style="text-align:center; margin-left:auto; margin-right:auto; background-color: rgb(255 255 255 / var(--tw-bg-opacity)); --tw-bg-opacity: 1; padding: 0.75rem; margin-top: 1rem;  width: fit-content;">
            <p class="text-lg" style="font-size: 1.125rem; line-height: 1.75rem">Hi,</p>
            <p>{{$name}} has invited you to join Lady Nexus, a safe, online platform  just for women.</p>
            <p>Please copy the token code below, you'll need when you register at <a class="underline text-lg" href="{{route('register')}}">Lady Nexus</a>.</p>
            <br>
            <p>Token code: <span id="token" class="font-bold" style="font-weight: 700;">{{$token}}</span></p>
            <p>This token will expire in 24 hours!</p>
        </div>
    </body>
</html>
