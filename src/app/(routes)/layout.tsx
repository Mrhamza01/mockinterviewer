import Header from '@/components/custom/Header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className='mx-5 md:mx20 lg:mx-36' >
      <Header />
      {children}
      </div>
    </div>
  );
}
