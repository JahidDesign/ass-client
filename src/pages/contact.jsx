import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import HeroSection from './contactBanner';
import OurTeam from './contactTeam';
import Swal from 'sweetalert2';

const ContactSection = () => {
  const formRef = useRef();
  const [sending, setSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    emailjs
      .sendForm(
        'your_service_id',     
        'your_template_id',    
        formRef.current,
        'your_public_key'     
      )
      .then(
        () => {
          setSending(false);
          Swal.fire('Success!', 'Your message has been sent.', 'success');
          formRef.current.reset();
        },
        (error) => {
          setSending(false);
          Swal.fire('Error!', 'Failed to send message.', 'error');
          console.error(error);
        }
      );
  };

  return (
    <div className="text-black">
      <HeroSection />
      <OurTeam />

      {/* Contact Section */}
      <section className="mb-32">
        {/* Google Map */}
        <div className="relative h-[300px] overflow-hidden bg-cover bg-[50%] bg-no-repeat">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d928763.03647253!2d91.05438503622733!3d24.589865340082575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375054d3d270329f%3A0x866f1ac20b3574a9!2sSylhet%20Division!5e0!3m2!1sen!2sbd!4v1750645258486!5m2!1sen!2sbd"
            width="100%"
            height="480"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="Google Map"
          ></iframe>
        </div>

        {/* Contact Form Card */}
        <div className="container px-6 md:px-12">
          <div className="block rounded-lg bg-white/80 px-6 py-12 shadow-lg md:py-16 md:px-12 -mt-[100px] backdrop-blur-lg border border-gray-300">
            <div className="flex flex-wrap">
              {/* Form */}
              <div className="mb-12 w-full md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
                <form ref={formRef} onSubmit={sendEmail}>
                  <div className="relative mb-6">
                    <input
                      type="text"
                      name="from_name"
                      id="name"
                      required
                      className="peer w-full rounded border-2 bg-transparent py-2 px-3 leading-6 outline-none transition-all"
                    />
                    <label htmlFor="name" className="absolute top-0 left-3 text-neutral-700 transition-all peer-focus:-translate-y-4 peer-focus:scale-75">
                      Name
                    </label>
                  </div>
                  <div className="relative mb-6">
                    <input
                      type="email"
                      name="from_email"
                      id="email"
                      required
                      className="peer w-full rounded border-2 bg-transparent py-2 px-3 leading-6 outline-none transition-all"
                    />
                    <label htmlFor="email" className="absolute top-0 left-3 text-neutral-700 transition-all peer-focus:-translate-y-4 peer-focus:scale-75">
                      Email address
                    </label>
                  </div>
                  <div className="relative mb-6">
                    <textarea
                      name="message"
                      id="message"
                      rows="3"
                      required
                      className="peer w-full rounded border-2 bg-transparent py-2 px-3 leading-6 outline-none transition-all"
                    ></textarea>
                    <label htmlFor="message" className="absolute top-0 left-3 text-neutral-700 transition-all peer-focus:-translate-y-4 peer-focus:scale-75">
                      Message
                    </label>
                  </div>
                  <div className="mb-6 flex items-center">
                    <input type="checkbox" id="copy" className="mr-2" defaultChecked />
                    <label htmlFor="copy" className="text-sm text-black">
                      Send me a copy of this message
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded bg-sky-500 text-white px-6 py-2 text-sm font-medium uppercase hover:bg-sky-600 transition"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="w-full lg:w-7/12">
                <div className="flex flex-wrap">
                  <div className="mb-12 w-full md:w-6/12 lg:w-full xl:w-6/12 px-3">
                    <div className="flex items-start">
                      <div className="rounded-md bg-sky-200 p-4 text-blue-600">📞</div>
                      <div className="ml-6">
                        <p className="mb-2 font-bold">Technical support</p>
                        <p className="text-sm text-neutral-700">sylhettravel@gmail.com</p>
                        <p className="text-sm text-neutral-700">01328-511999</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-12 w-full md:w-6/12 lg:w-full xl:w-6/12 px-3">
                    <div className="flex items-start">
                      <div className="rounded-md bg-sky-200 p-4 text-blue-600">📨</div>
                      <div className="ml-6">
                        <p className="mb-2 font-bold">General inquiry</p>
                        <p className="text-sm text-neutral-700">info@sylhettouristguide.com</p>
                        <p className="text-sm text-neutral-700">+88 01714-936886</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactSection;
