import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
    try {
        const submissions = await prisma.contactUs.findMany({
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json(
            { success: true, data: submissions },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error fetching contact submissions:', error);
        return NextResponse.json(
            { error: 'Failed to fetch submissions' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Save to database using Prisma
    const contactSubmission = await prisma.contactUs.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    // Success response
    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
        data: contactSubmission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}