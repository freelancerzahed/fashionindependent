    <!-- Loader -->
    <div class="loader-container">
        <div class="loader"></div>
    </div>
    <header class="header" id="homePageHeader">
        <div class="header_top" role="navigation">
            <div class="empty_div"></div>
            <div class="header_top_title">
                <p>MIRROR ME FASHION <sup>BETA</sup></p>
            </div>
            <div class="header_top_action">
                @auth
                <a href="{{route('logout')}}">Log Out</a>
                <a href="{{route('get_user_profile')}}">Profile</a>
                @endauth
                @guest
                <a href="{{route('login')}}">Log In</a>
                <a href="#">Join Now</a>
                @endguest
              
            </div>
        </div>
        <div class="header_middle" role="navigation">
            <div class="logo">
                @guest
                <a href="{{ route('home') }}">
                    @php
                        $header_logo = get_setting('header_logo');
                    @endphp
                    @if($header_logo != null)
                        <img src="{{ uploaded_asset($header_logo) }}" alt="{{ env('APP_NAME') }}" class="logo">
                    @else
                        <img src="{{ static_asset('assets/img/logo.png') }}" alt="{{ env('APP_NAME') }}" class="logo" >
                    @endif
                </a>
                @endguest
                @auth
                <a href="{{ route('get_user_profile') }}">
                    @php
                        $header_logo = get_setting('header_logo');
                    @endphp
                    @if($header_logo != null)
                        <img src="{{ uploaded_asset($header_logo) }}" alt="{{ env('APP_NAME') }}" class="logo">
                    @else
                        <img src="{{ static_asset('assets/img/logo.png') }}" alt="{{ env('APP_NAME') }}" class="logo" >
                    @endif
                </a>
               
                @endauth
              
            </div>
            <div class="socail_link">
                <ul class="social_icons social">
                    <li class="item">
                        <a class="facebook" rel="noopener noreferrer" href="https://www.facebook.com/mirrormefashion">
                            <svg height="16" width="10" fill="#990000" viewBox="0 0 320 512">
                                <path
                                    d="M80 299.3V512H196V299.3h86.5l18-97.8H196V166.9c0-51.7 20.3-71.5 72.7-71.5c16.3 0 29.4 .4 37 1.2V7.9C291.4 4 256.4 0 236.2 0C129.3 0 80 50.5 80 159.4v42.1H14v97.8H80z" />
                            </svg></a>
                    </li>
                    <li class="item"> <a class="twitter" rel="noopener noreferrer" href="https://www.twitter.com/mirrormefashion"><svg height="16"
                                fill="#990000" width="16" viewBox="0 0 512 512">
                                <path
                                    d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103v-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z" />
                            </svg></a> </li>
                    <li class="item"> <a class="linkedin" rel="noopener noreferrer" href="https://www.linkedin.com/company/mirrormefashion"><svg
                                fill="#990000" height="16" width="14" viewBox="0 0 448 512">
                                <path
                                    d="M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.8 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z" />
                            </svg></a> </li>
                    <li class="item"> <a class="instagram" rel="noopener noreferrer" href="https://www.instagram.com/mirrormefashion/"><svg
                                fill="#990000" height="16" width="14" viewBox="0 0 448 512">
                                <path
                                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                            </svg></a> </li>
                </ul>
            </div>
            <div id="navToggle" class="nav_toggle" onclick="mainNavBarInit()">

                <svg viewBox="0 0 50 50" width="30px" height="30px" fill="white"><path d="M 0 7.5 L 0 12.5 L 50 12.5 L 50 7.5 Z M 0 22.5 L 0 27.5 L 50 27.5 L 50 22.5 Z M 0 37.5 L 0 42.5 L 50 42.5 L 50 37.5 Z"/></svg>
            </div>
        </div>

        <nav class="main_menu">
            <ul class="menu_container" id="homePageMenu">
                <li>
                    <a href="http://localhost/mirrormefashion">Home</a>
                </li>
                <li>
                    <a href="http://localhost/mirrormefashion/blog">Blog</a>
                </li>
                <li>
                    <a href="http://localhost/mirrormefashion/about">About</a>
                </li>
                <li>
                    <a href="http://localhost/mirrormefashion/shop">Shop</a>
                </li>
            </ul>
        </nav>

    </header>