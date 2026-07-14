import Navbar from '@/src/components/Navbar';
import Hero from '@/src/components/Hero';
import Categories from '@/src/components/Categories';
import Footer from '@/src/components/Footer';
import Developer from '@/src/components/Developer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        
        <div id="categories" className="relative">
          <Categories />
        </div>

        <Developer />
      </main>
      
      <Footer />
    </>
  );
}
