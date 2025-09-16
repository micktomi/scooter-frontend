"use client";
import { redirect } from 'next/navigation';

export default function Home() {
  // Ενοποιούμε την εμπειρία: η κεντρική σελίδα ανακατευθύνει στο μοντέρνο dashboard
  redirect('/homepage');
}
