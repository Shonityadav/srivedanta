<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Series;

class ReportController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    // Show all series
    public function index()
    { 
        $data = Series::orderBy('name')->get(); 
        return view('report.index', compact('data'));
    }

    // Show form to create series
    public function create()
    {
        return view('series.create');
    }

    // Save new series
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|min:1',
            'description' => 'nullable'
        ]);

        $result = Series::create([
            'name' => $request->name,
            'description' => $request->description,
        ]);
        
        if($result){
            return redirect()->route('series.index')->with('success', 'Series created successfully!');
        }
        return back()->with('error', 'Something went wrong!');
    }

    // Show a single series
    public function show($id)
    {
        $data = Series::with('ebooks')->findOrFail($id);
        return view('series.show', compact('data'));
    }

    // Edit form
    public function edit($id)
    {
        $data = Series::findOrFail($id); 
        return view('series.edit', compact('data'));
    }

    // Update series
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|min:1',
            'description' => 'nullable'
        ]);

        $series = Series::findOrFail($id);
        $series->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return redirect()->route('series.index')->with('success', 'Series updated successfully!');
    }

    // Delete series
    public function destroy($id)
    {
        $result = Series::destroy($id);
        
        if($result){
            return back()->with('success', 'Series deleted successfully!');
        }
        return back()->with('error', 'Something went wrong!');
    }
}

