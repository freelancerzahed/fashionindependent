@extends('frontend.layouts.app')
@section('content')

<main>
  <section class="">
    <img src="{{ asset('public/assets/img/about/about_1.jpg') }}" alt="stylish straw fedora hat on neck of female mannequin"
    style="width:100%">
    <div class="text-center" id="remarks">
      <h1>Mirror Me Fashion</h1>
      <h2>Discover Your Niche</h2>
      <div id="row2-about">
        <h2 class="text-center">Professional Styling at Your Finger-tips</h2>
        <p class="p-about">Mirror Me Fashion is revolutionizing the way you buy clothes by bringing AI
        (Artificial Intelligence) to fashion. Our smart technology powers the Virtual
        Fashion Stylist, the first and only intelligent software agent for fashion. </p>

        <p class="p-about">Named Sophia, the Virtual Fashion Stylist can advise you on what
        to wear. Simply answer a few questions from the <a href="/#MirrorMeFashion-Virtual_Stylist">
        Virtual Stylist Chat</a> and Sophia will guide you to fashion that fits and flatters.</p>

        <p class="p-about">We want people everywhere to face the world with more confidence no
        matter your body type. To start your free chat with Sophia register to
        <a href="{{ URL('/#MirrorMeFashion-Virtual_Stylist')}}"> become a member</a>
        on the home page and then open the chat window on your profile page. </p>

        <p class="p-about" id="p4">Welcome to the end of your struggle deciding what fashion to buy
            and wear. <br>Welcome to the future of fashion.</p>
      </div>
    </div><!------- end remarks --->

    <div class="intro pri-pad-b" style="background: #f5f5f5; padding: 50px 0; margin-bottom: 50px;">
      <div class="followers text-center">
        <h6 class="mb-50 sec-color">Follow and like us on social media</h6>
        <ul class="list-inline my-3 my-md-0 social colored text-center">
          <li class="list-inline-item"> <a class="facebook" href="https://www.facebook.com/mirrormefashion"><i class="lab la-facebook-f"></i></a>
          </li>
          <li class="list-inline-item"> <a class="twitter" href="https://www.twitter.com/mirrormefashion"><i class="lab la-twitter"></i></a> </li>
          <li class="list-inline-item"> <a class="linkedin" href="https://www.linkedin.com/company/mirrormefashion"><i class="lab la-linkedin-in"></i></a> </li>
          <li class="list-inline-item"> <a class="instagram" href="https://www.instagram.com/mirrormefashion/"><i class="lab la-instagram"></i></a>
          </li>
      </ul>
         
        </div>
        <!--parallax-->
    </div><!---- end social media wrap -->


    <div class="container-fluid">
      <div class="row" style="margin-bottom:3vw">
        <div class="col-md-8">
          <img src="{{ asset('public/assets/img/about/about_2.jpg') }}" style="width:100%">
        </div>
        <div class="col-md-4" id="meet-soph">
          <h3 id="VS-about" style="color:#990000">The Virtual Fashion Stylist</h3>
          <h4 class="text-orange">#MeetSophia</h4>
          <p class="p2-a">The future of fashion is here with the Virtual Stylist. </p>
          <p class="p2-a">Sophia is an intelligent agent that gives fashion styling advice tailored to your specific
            needs. As an on-demand service, Sophia is available 24/7 to chat, free of cost.</p><p class="p2-a">
            This tool is designed to help you access free and instant fashion advice and find clothes that flatter
            and fit now matter how big or small your budget.</p>
          <p class="p2-a">Finding clothes that you love is hard. Let us help you finally end the struggle of
            deciding what to wear. <a href="{{ URL('/#MirrorMeFashion-Virtual_Stylist')}}">Free Fashion Advice</a></p>
        </div>
      </div><!--- end row 1 ---->
      <div class="row">
        <div class="col-md-6" id="seller-img">
          <img id="ws-img" src="{{ asset('public/assets/img/about/about_3.jpg') }}" style="width:100%">
        </div>
        <div class="col-md-6">
          <h3 style="color:#990000">Become a Mirror Me Fashion Seller</h3>
          <p class="p2-a">Mirror Me Fashion has a serious goal to style every man, woman and child around the world.
            To achieve this goal we require trendy merchandize from ambitious retailers like you.
            Our customers want and need your products!</p>
            
          <p class="p2-a">As our membership grows, so does the
              demand for stylish apparel. Become a Mirror Me Fashion Seller today and grow your business with us.</p>
          </p>

          <p class="p2-a">Are you a fashion professional? Our Platform is welcome to all. Influencers, 
          Bloggers, Stylists and other Fashion Professionals can monetize and expand with our help. 
          <a href="{{ URL('/fashion-professional')}}">Learn more</a> about partnering with us to grow 
          your business or simply click the Fashion Professional button to get started. 
          </p>
          <a href="{{ URL('/webstore')}}" class="btn btn-primary" id="ws-btn">BECOME A SELLER</a>
          <a href="{{ URL('/fashion-professional')}}" class="btn btn-primary" id="ws-btn">FASHION PROFESSIONAL</a>
        </div>
      </div><!--- end row 2 ---->
    </div><!---- end container -->

    <div class="row" id="alpha-rel">
      <div class="text-center">
        <h4 style="color:#990000">Alpha Release - Version 1.2.18</h4>
        <p class="alpha-p">Congratulations on being first to explore our technology, the first and only on-demand
          Virtual Fashion Stylist. Being here gives you an opportunity to meaningfully participate in the
          development of our technology. </p>

        <p class="alpha-p">We welcome you to share your thoughts on what you like/dislike/want to see from the
          Virtual Stylist and website. Your feedback will be used to improve our service. Learn about what’s to
          come for the <a href="{{ URL('/alpha') }}">next version of the Virtual Fashion Stylist</a>.</p>
        <p id="ty">Thank you for journeying with us! </p>
      </div>
    </div> <!--- end intro row --->


    <div class="row" id="info">
    <div class="col-sm-3"></div>
      <div class="col-sm-3 " id="social-links">
        <a href="mailto:support@yourdomain.com" class="font-white">
        <i class="fa fa-envelope-o"></i>
        press@mirrormefashion.com</a>
        <br>
        <a href="mailto:support@yourdomain.com" class="font-white">
        <i class="fa fa-envelope-o"></i>
        info@mirrormefashion.com</a>
        <br>
        <a href="mailto:support@yourdomain.com" class="font-white">
        <i class="fa fa-envelope-o"></i>
        support@mirrormefashion.com</a>
      </div>
      <div class="col-sm-3 text-center" style="margin-top:10px">
        <h5>FOLLOW US ONLINE</h5>
        <ul class="list-inline my-3 my-md-0 social colored text-center">
          <li class="list-inline-item"> <a class="facebook" href="https://www.facebook.com/mirrormefashion"><i class="lab la-facebook-f"></i></a>
          </li>
          <li class="list-inline-item"> <a class="twitter" href="https://www.twitter.com/mirrormefashion"><i class="lab la-twitter"></i></a> </li>
          <li class="list-inline-item"> <a class="linkedin" href="https://www.linkedin.com/company/mirrormefashion"><i class="lab la-linkedin-in"></i></a> </li>
          <li class="list-inline-item"> <a class="instagram" href="https://www.instagram.com/mirrormefashion/"><i class="lab la-instagram"></i></a>
          </li>
      </ul>
      </div>
      <div class="col-sm-3"></div>
    </div><!----end about-social row--->
  </section>


</main>
<!-- End -->
@endsection

