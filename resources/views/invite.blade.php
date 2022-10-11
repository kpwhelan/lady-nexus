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
    <body class="antialiased bg-slate-200">
        <img src={{asset('images/LadyNexus-logo.png')}} class="block h-52 w-52 rounded-full mx-auto mt-4" style="display: block; height:13rem; width:13rem; border-radius: 9999px; margin-left:auto; margin-right:auto; margin-top:1rem" />
        <div class="mx-auto bg-white p-3 mt-4 w-fit">
            <p class="text-lg">Hi,</p>
            <p>{{$name}} has invited you to join Lady Nexus, a safe, online platform  just for women.</p>
            <p>Please copy the token code below, you'll need when you register at <a class="underline text-lg" href="{{route('register')}}">Lady Nexus</a>.</p>
            <br>
            <p>Token code: <span id="token" class="font-bold">{{$token}}</span></p>
            <p>This token will expire in 24 hours!</p>
        </div>
    </body>
</html>
