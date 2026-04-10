@extends('frontend.layouts.app')
@section('content')

 <hr>
 <main>
    <section class="page-title pri-pad-b py-5 ml-5 mr-5">
     <h3 class="text-center">Mirror Me Fashion Alpha 1.2.18</h3>
      <div class="container-fluid" id="beta_page">
        <h1>About Alpha</h1>
        <p>The current alpha release cycle (version 1.2.18) uses rudimentary tools to give you styling
            advice for your body shape.  Over the coming months, we will be hard at work to make Sophia
            more intelligent. Here’s what you can expect from the <a href="{/virtual-stylist}">Virtual Styling</a> tool in the future: </p>
        <ul>
            <ol>-Greater recognition of human language and more natural communication </ol>
            <ol>-Styling advice for all settings and situations (e.g. dates, formal events, different weather)</ol>
            <ol>-Fashion products from a wide selection of retailers around the globe</ol>
            <ol>-Advanced features to improve and personalize your shopping experience</ol>
        </ul>

        <h2>What’s to come for v.1.0.18?</h2>
        <p><b style="color: #990000;">Your body data. </b><br>To give you accurate advice we need your complete body profile. These measurements allow Sophia to give you personalized fashion advice based on your unique attributes, not general body shapes. </p>
        <p>Our next major release will include a body digitizer to capture your full measurements. In the dialog window on your profile, ask Sophia <b>how can I participate</b>.</p>
        <p><b style="color: #990000;">Platform update. </b> <br>The next website update is aimed at improving your experience. That includes top website speeds with better tools for ecommerce and interacting with your friends.  </p>
        <p><b style="color: #990000;">Fashion merchandize. </b> <br>What’s the point of getting free styling advice if product recommendations don’t follow it? We love helping you shop in and outside of Mirror Me Fashion for the products you want. But because our mission is to ease your shopping experience, our next release will include streamlined Sophia recommendations and easy, quick assess to product you want. </p>
        <p><b style="color: #990000;">Men's Styling help</b>. <br>Men want to look good too! Male styling is our top priority. <a href="{{'/subscribe'}}">Subscribe</a> to be notified when we update the site with male styling advice.</p><br><br>
        <p>Subscribe and follow us on online to stay up to date with new updates and <a href="{{ URL('/news')}}">company news</a>.</p>
    </div>

</section>
</main>




<!-- End -->
@endsection
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>

