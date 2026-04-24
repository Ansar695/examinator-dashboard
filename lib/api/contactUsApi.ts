import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: ContactSubmission;
}

export interface ContactError {
  error: string;
}

export const contactUsApi = createApi({
  reducerPath: 'contactUsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    submitContactForm: builder.mutation<ContactResponse, ContactFormData>({
      query: (data) => ({
        url: '/contact-us',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Contact'],
    }),
  }),
});

export const { useSubmitContactFormMutation } = contactUsApi;