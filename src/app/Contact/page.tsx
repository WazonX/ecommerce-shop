export default function Contact() {
    return (
        <div>
            <div className="p-8 font-[quantico]">
                <h1 className="text-4xl mb-8">Contact Us</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-2xl mb-4">Get in Touch</h2>
                        <div className="space-y-2">
                            <p className="text-zinc-400">
                                Have questions about our products or services? We're here to help!
                            </p>
                            <div className="mt-4">
                                <h3 className="text-xl mb-2">Contact Information</h3>
                                <ul className="space-y-2 text-zinc-400">
                                    <li>Email: s33464@pjwstk.edu.pl</li>
                                    <li>Phone: +48 123 456 789</li>
                                    <li>Address: Warsaw, Poland</li>
                                </ul>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-xl mb-2">Business Hours</h3>
                                <ul className="space-y-2 text-zinc-400">
                                    <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
                                    <li>Saturday: 10:00 AM - 4:00 PM</li>
                                    <li>Sunday: Closed</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-800 p-6 rounded-lg">
                        <h2 className="text-2xl mb-6">Send us a Message</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full p-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-white"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block mb-2">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full p-2 bg-zinc-700 rounded focus:outline-none focus:ring-2 focus:ring-white"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-white text-black px-6 py-2 rounded hover:bg-zinc-200 transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

