import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      firstName, 
      lastName, 
      email, 
      school, 
      role, 
      students, 
      message 
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !school || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize Supabase client
    const cookieStore = cookies();
    const supabase = await createClient();

    // Insert demo request into database
    const { data, error } = await supabase
      .from('school_demo_requests')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          school_name: school,
          role,
          student_count: students,
          message,
          status: 'pending'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving demo request:', error);
      return NextResponse.json(
        { error: 'Failed to save demo request' },
        { status: 500 }
      );
    }

    // TODO: Send notification email to admin and confirmation email to user
    // This can be implemented using your preferred email service

    return NextResponse.json(
      { 
        message: 'Demo request submitted successfully',
        requestId: data.id 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing demo request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}