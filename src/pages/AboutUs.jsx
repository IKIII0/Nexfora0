import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Login from '../components/Login'
import TeamCard from '../components/TeamCard'
import { FaBullseye, FaEye, FaHeart } from 'react-icons/fa'

export default function AboutUs() {
    const [showLogin, setShowLogin] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    if (showLogin) {
        return <Login onBack={() => setShowLogin(false)} />
    }

    const teamMembers = [
        {
            name: 'Rifki Al Sauqy',
            role: 'CEO & Founder',
            photo: '/img/Rifki.jpg',
            description: 'Seorang Pengajar dari Nexfora',
        },
        {
            name: 'Yehezkiel Gustav Setiawan S',
            role: 'CEO & Founder',
            photo: '/img/Kiel.jpg',
            description: 'Seorang UI/UX Designer dari Nexfora',
        },
        {
            name: 'M. Diaz William Bevan',
            role: 'CEO & Founder',
            photo: '/img/Willy.jpg',
            description: 'Seorang jasa pembuatan website dari Nexfora berbasis wordpress',
        },
        {
            name: 'M. Farhan Prasetyo',
            role: 'CEO & Founder',
            photo: '/img/Farhan.jpg',
            description: 'Seorang jasa pembuatan website dari Nexfora berbasis wordpress',
        },
    ]

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-blue-950 text-white font-sans">
            <Navbar
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Hero */}
            <header className="container mx-auto text-center py-16 md:py-24 px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-on-load animate-fade-in-up">
                    Tentang Nexfora
                </h1>
                <p className="text-gray-300 max-w-2xl mx-auto animate-on-load animate-fade-in-up delay-200">
                    Nexfora adalah platform terpadu untuk belajar pemrograman dan memesan jasa pembuatan website profesional. Kami hadir untuk membantu Anda meningkatkan skill dan mewujudkan proyek impian.
                </p>
            </header>

            {/* Misi, Visi, Nilai */}
            <section className="container mx-auto px-6 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-on-load animate-fade-in-up">
                        <div className="flex items-center gap-3 mb-3">
                            <FaBullseye className="text-blue-400" size={28} />
                            <h3 className="text-xl font-semibold">Misi</h3>
                        </div>
                        <p className="text-gray-300">
                            Memberikan pembelajaran dan layanan digital yang berkualitas, terjangkau, dan relevan dengan kebutuhan industri.
                        </p>
                    </div>

                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-on-load animate-fade-in-up delay-100">
                        <div className="flex items-center gap-3 mb-3">
                            <FaEye className="text-purple-400" size={28} />
                            <h3 className="text-xl font-semibold">Visi</h3>
                        </div>
                        <p className="text-gray-300">
                            Menjadi platform edukasi dan layanan digital pilihan untuk generasi inovatif di Indonesia.
                        </p>
                    </div>

                    <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 animate-on-load animate-fade-in-up delay-200">
                        <div className="flex items-center gap-3 mb-3">
                            <FaHeart className="text-pink-400" size={28} />
                            <h3 className="text-xl font-semibold">Nilai</h3>
                        </div>
                        <p className="text-gray-300">
                            Fokus pada kualitas, kolaborasi, dan dampak nyata bagi pengguna serta komunitas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Tim */}
            <section id="team" className="container mx-auto px-6 pb-16">
                <h2 className="text-3xl font-bold text-center mb-4 animate-on-load animate-fade-in-up">
                    Core Team of Nexfora
                </h2>
                <p className="text-center text-gray-300 mb-10 max-w-2xl mx-auto animate-on-load animate-fade-in-up delay-100">
                    Kenalan dengan orang-orang hebat di balik kesuksesan Nexfora
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {teamMembers.map((member, index) => (
                        <div key={index} className={`animate-on-load animate-fade-in delay-${(index + 4) * 100}`}>
                            <TeamCard
                                name={member.name}
                                role={member.role}
                                photo={member.photo}
                                description={member.description}
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Kontak */}
            <section className="container mx-auto px-6 pb-20">
                <div className="max-w-3xl mx-auto text-center bg-gray-900/40 border border-gray-800 rounded-2xl p-8">
                    <h3 className="text-2xl font-semibold mb-3">Butuh bantuan atau ingin bekerja sama?</h3>
                    <p className="text-gray-300 mb-6">Hubungi kami untuk konsultasi gratis dan diskusikan kebutuhan Anda.</p>
                    <a
                        href="https://wa.me/6282273875270"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-purple-500/50"
                    >
                        Hubungi Kami
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    )
}

