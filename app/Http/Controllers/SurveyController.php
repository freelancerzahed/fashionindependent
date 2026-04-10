<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
       $surveys = Survey::where('user_id',auth()->user()->id)->get();

        return view('backend.survey.index',compact('surveys'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('backend.survey.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       $data = request()->validate([
        'title'=>'required',
        'purpose'=>'required'
       ]);

       $surveys = auth()->user()->surveys()->create($data);
       
       if($surveys){
      
        flash(translate('Survey has created successfully'))->success();
        return redirect()->route('surveys.index');
    }
      
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
       $survey = Survey::findOrFail($id);
        return view('backend.survey.show',compact('survey'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request)
    {
        $survey = Survey::findOrFail($request->id);
        $survey->title = $request['title'];
        $survey->purpose= $request['purpose'];
       if( $survey->update()){
        flash(translate('Survey has been successfully updated!'))->success();
        return redirect()->route('surveys.index');
       }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
       $survey = Survey::findOrFail($id);
       $questions = $survey->questions();
       
    }
}
