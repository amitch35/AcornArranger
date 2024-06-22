import {RealtimePostgresInsertPayload, createClient} from '@supabase/supabase-js'
import { Database } from '../../database.types'
import dotenv from "dotenv";
import nodemailer from 'nodemailer';

dotenv.config({ path: ['.env.local', '.env'] });

const supabase = createClient<Database>(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      }
    );

supabase.auth.signInWithPassword(
  {
    email: process.env.SUPABASE_SERVER_ACCT_EMAIL!,
    password: process.env.SUPABASE_SERVER_ACCT_PSWD!,
  }
);

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465, 
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USR,
    pass: process.env.SMTP_PSWD, 
  },
});

type ErrorLogRecord = {
  created_at: string;
  error_message: string;
  function_name: string;
  id: number;
};

// Define a function to send an email
const sendErrorEmail = async (errorLog: ErrorLogRecord) => {
  const mailOptions = {
    from: `"AcornArranger" <${process.env.SMTP_EMAIL}>`,
    to: `${process.env.DEV_EMAIL}`,
    subject: `Error in function: ${errorLog.function_name}`,
    html: `<p>An error occurred in function <strong>${errorLog.function_name}</strong>:</p><p>${errorLog.error_message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Error email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const handleErrorLogInserts = async (payload: RealtimePostgresInsertPayload<ErrorLogRecord>) => {
  // console.log('Change received!', payload)
  const { new: errorLog } = payload;
  
  if (errorLog.function_name !== 'build_schedule_plan') {
    await sendErrorEmail(errorLog);
  }
}

// Listen to inserts
supabase
  .channel('error_log')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'error_log' }, handleErrorLogInserts)
  .subscribe()

export const supabaseClient = supabase;