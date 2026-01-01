<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;

Route::get('test-students', function () {
    return response()->json(['msg' => 'It works!']);
});
Route:: get('/', function() {
    return response()->json(['message' => 'Welcome to the School Management API']);
});
Route::apiResource('students', StudentController::class);