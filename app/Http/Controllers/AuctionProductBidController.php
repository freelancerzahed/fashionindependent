<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuctionProductBidController extends Controller
{
    public function store(Request $request)
    {
        return response()->json(['message' => 'Bid placed successfully']);
    }
}
