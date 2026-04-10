


<section class="text-center text-secondary blog-banner">
	<div class="container-fluid">
		<div class="row">
			<div class="col">
				
				<h1 id="blog-header-text">Mirror Me Fashion Top Stories</h1>
				<p style="color:#a50007">Last Updated: <span id="blog-stamp">
					@php
					$last_update = App\Blog::latest('updated_at')->first();
					
					@endphp
					{{ \Carbon\Carbon::parse($last_update->updated_at)->isoFormat('MMM Do YYYY') }}
					
				</span></p>
			</div>
		</div>
	</div>
</section>
<section class="blog_section">
	<div id="slider">  
		<div class="slides">  
			<img id="slide-one" src="{{ static_asset('assets/img/blog/s25.png') }}" alt="fashionable woman by the beach" />
			<div class="content overlay-content">
				<div>
					<h1 class="section-title">Powerful AI Technology</h1>
					<h2>Meet the Only Virtual Fashion Stylist</h2>					
				</div>
			</div>
		</div>
		<div class="slides">  
			<img id="slide-two" src="{{ static_asset('assets/img/blog/s24.png') }}" alt="hip hop male holding fitted cap facing downward" />
			<div class="content overlay-content">
				<div>
					<h1 class="section-title">Agnostic Styling Advice</h1>
					<h2>Find Fashion that Fits and Flatters</h2>					
				</div>
			</div>
		</div>
		<div class="slides">  
			<img id="slide-three" src="{{ static_asset('assets/img/blog/blog-classic-8.png') }}" alt="bohemian chic young woman" />
			<div class="content overlay-content">
				<div>
					<h1 class="section-title">Find Fashion That Fits and Flatters</h1>
					<h2>Meet Sophia Today</h2>					
				</div>
			</div>
		</div>
	</div>
</section>
<section class="blog_nav">
	<div class="blog-col"><a href="">News & Trends</a></div>
	<div class="blog-col"><a href="">Celebrity Style</a></div>
	<div class="blog-col"><a href="">Men's Styling</a></div>
	<div class="blog-col"><a href="">Styling Your Body Shape</a></div>
</section>
<section id="category_part">
	<div class="container-fluid">
		<div class="row text-center">
		    @foreach(\App\BlogCategory::get() as $category)
		     <div class="col-md-3 col-sm-6 my-2">
				<div class="category-box">

				
				
				</div>
		    </div>
		    @endforeach
		</div>
	</div>
</section>
