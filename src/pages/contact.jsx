import React, { useRef, useState, useContext } from "react";
import emailjs from "@emailjs/browser";
import HeroSection from "./contactBanner";
import OurTeam from "./contactTeam";
import Swal from "sweetalert2";
import { ThemeContext } from "../context/ThemeContext";
import AnimatedSection from "../components/secret/AnimatedSection";
const ContactSection = () => {
  const formRef = useRef();
  const [sending, setSending] = useState(false);
  const { theme } = useContext(ThemeContext);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    emailjs
      .sendForm(
        "your_service_id",
        "your_template_id",
        formRef.current,
        "your_public_key"
      )
      .then(
        () => {
          setSending(false);
          Swal.fire("Success!", "Your message has been sent.", "success");
          formRef.current.reset();
        },
        (error) => {
          setSending(false);
          Swal.fire("Error!", "Failed to send message.", "error");
          console.error(error);
        }
      );
  };

  return (
    <div className={theme === "dark" ? " text-white" : " text-black"}>
      <HeroSection />
    <AnimatedSection>
      <OurTeam />

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
          />
        </div>

        {/* Contact Form */}
        <div className="container px-6 md:px-12">
          <div
            className={`block rounded-lg px-6 py-12 shadow-lg md:py-16 md:px-12 -mt-[100px] backdrop-blur-lg border ${
              theme === "dark" ? "bg-gray-800/80 border-gray-600" : "bg-white/80 border-gray-300"
            }`}
          >
            <div className="flex flex-wrap">
              {/* Form */}
              <div className="mb-12 w-full md:px-3 lg:mb-0 lg:w-5/12 lg:px-6">
                <form ref={formRef} onSubmit={sendEmail}>
                  <InputField id="name" name="from_name" label="Name" theme={theme} />
                  <InputField id="email" name="from_email" label="Email address" type="email" theme={theme} />
                  <TextAreaField id="message" name="message" label="Message" theme={theme} rows={4} />

                  <div className="mb-6 flex items-center">
                    <input type="checkbox" id="copy" className="mr-2" defaultChecked />
                    <label htmlFor="copy" className="text-sm">
                      Send me a copy of this message
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded bg-sky-500 text-white px-6 py-2 text-sm font-medium uppercase hover:bg-sky-600 transition"
                  >
                    {sending ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <ContactInfo theme={theme} />
            </div>
          </div>
        </div>
      </section>
  </AnimatedSection>
    </div>
  );
};

// Input Component
const InputField = ({ id, name, label, type = "text", theme }) => (
  <div className="relative mb-6">
    <input
      type={type}
      name={name}
      id={id}
      required
      className={`peer w-full rounded border-2 bg-transparent py-2 px-3 leading-6 outline-none transition ${
        theme === "dark" ? "border-gray-600 text-white" : "border-gray-300 text-black"
      }`}
    />
    <label
      htmlFor={id}
      className={`absolute top-0 left-3 transition-all peer-focus:-translate-y-4 peer-focus:scale-75 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </label>
  </div>
);

const TextAreaField = ({ id, name, label, rows, theme }) => (
  <div className="relative mb-6">
    <textarea
      name={name}
      id={id}
      rows={rows}
      required
      className={`peer w-full rounded border-2 bg-transparent py-2 px-3 leading-6 outline-none transition ${
        theme === "dark" ? "border-gray-600 text-white" : "border-gray-300 text-black"
      }`}
    />
    <label
      htmlFor={id}
      className={`absolute top-0 left-3 transition-all peer-focus:-translate-y-4 peer-focus:scale-75 ${
        theme === "dark" ? "text-gray-300" : "text-gray-700"
      }`}
    >
      {label}
    </label>
  </div>
);

const ContactInfo = ({ theme }) => (
  <div className="w-full lg:w-7/12">
    <div className="flex flex-wrap">
      <InfoCard
        icon="📞"
        title="Technical support"
        lines={["sylhettravel@gmail.com", "01328-511999"]}
        theme={theme}
      />
      <InfoCard
        icon="📨"
        title="General inquiry"
        lines={["info@sylhettouristguide.com", "+88 01714-936886"]}
        theme={theme}
      />
    </div>
  </div>
);

const InfoCard = ({ icon, title, lines, theme }) => (
  <div className="mb-12 w-full md:w-6/12 lg:w-full xl:w-6/12 px-3">
    <div className="flex items-start">
      <div className={`rounded-md p-4 ${theme === "dark" ? "bg-sky-700 text-white" : "bg-sky-200 text-blue-600"}`}>{icon}</div>
      <div className="ml-6">
        <p className="mb-2 font-bold">{title}</p>
        {lines.map((line, i) => (
          <p key={i} className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-neutral-700"}`}>
            {line}
          </p>
        ))}
      </div>
    </div>
  </div>
);

export default ContactSection;
