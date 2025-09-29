import Head from 'next/head';
import { FC, useState } from 'react';
import '../app/globals.css';
import Navigation from '@/components/Navigation';
const Contact: FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message sent by ${formData.name}`);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <Head>
        <title>Contact Me - My Portfolio</title>
        <meta name="description" content="Get in touch with me for collaborations or inquiries." />
      </Head>
      <Navigation />
      <section className="py-16 bg-gray-100 text-gray-900 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-4xl w-full px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Contact Me</h2>
          <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg mx-auto" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-left font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-left font-semibold">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={5}
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;