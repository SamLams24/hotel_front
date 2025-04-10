<template>
   <div>
    <div class="relative">
      <img
        :src="images[currentImage]"
        class="w-full h-[500px] object-cover transition duration-700"
      />
      
      <div class="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-4/5 max-w-4xl bg-white bg-opacity-90 rounded-lg shadow-lg p-4">
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1 font-serif">Arrivée</label>
            <input 
              type="text" 
              id="checkin-date" 
              v-model="checkinDate"
              ref="checkinInput"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent font-serif"
              placeholder="Date d'arrivée">
          </div>
          
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-1 font-serif">Départ</label>
            <input 
              type="text" 
              id="checkout-date" 
              v-model="checkoutDate"
              ref="checkoutInput"
              class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent font-serif"
              placeholder="Date de départ">
          </div>
          
          <div class="flex items-end">
            <button 
              @click="searchRooms"
              class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition duration-300 w-full font-serif">
              Rechercher
            </button>
          </div>
        </div>
      </div>

      <button @click="prevImage" class="absolute left-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70">
        ‹
      </button>
      <button @click="nextImage" class="absolute right-5 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70">
        ›
      </button>
    </div>

    <section class="text-center py-16 bg-green-50">
      <h2 class="text-3xl md:text-4xl text-green-600 font-serif">
        Offrez-vous une escapade de rêve dans nos hôtels d'exception
      </h2>
      <p class="mt-4 text-black-600 text-lg font-serif">Des séjours inoubliables vous attendent, car nos hôtels, ce sont</p>
    </section>

    <section class="py-16 bg-white">
  <h3 class="text-2xl md:text-3xl text-center text-green-600 mb-10 font-serif">
    Des vues incroyables 🌴
  </h3>

  <div class="relative max-w-6xl mx-auto px-4">
    <div class="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
      
      <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
            <h4 class="text-lg font-semibold text-green-600 font-serif">Palais Méditerranéen</h4>
            <p class="mt-2 text-black-600 text-sm font-serif">
              Un joyau architectural inspiré des traditions méditerranéennes, alliant élégance et modernité.
            </p>
          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im5.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>


        <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
          <h4 class="text-lg font-semibold text-green-600 font-serif">Pagode Céleste</h4>
            <p class="mt-2 text-black-600 text-sm font-serif">
              Une interprétation moderne des temples asiatiques, avec toitures incurvées et jardins zen suspendus en plein ciel urbain.            </p>
          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im1.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>


        <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
          <h4 class="text-lg font-semibold text-green-600 font-serif">Eden Tropical</h4>
            <p class="mt-2 text-black-600 text-sm font-serif">
              Structure organique épousant la jungle, avec toits végétalisés et passerelles aériennes entre les arbres centenaires.            </p>
          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im11.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>
        
        <div class="flex-shrink-0 w-[150px] w-1/2 p-4 flex flex-col justify-center font-serif">
      <a href="/chambres" class="inline-flex items-center text-green-600 text-lg font-semibold hover:underline hover:text-green-900 transition">
        Voir plus <span class="ml-2">→</span>
      </a>
    </div>
    </div>
    
  </div>
</section>

<section class="py-16 bg-white">
  <h3 class="text-2xl md:text-3xl text-center text-green-600 mb-10 font-serif">
    Des architectures atypiques 🏠
  </h3>

  <div class="relative max-w-6xl mx-auto px-4">
    <div class="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
      
      <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
          <h4 class="text-lg font-semibold text-green-600 font-serif">Hôtel Océanide</h4>
            <p class="mt-2 text-black-600 text-sm font-serif">
              📍 Ile Maldives
            </p>

            <p class="mt-2 text-black-600 text-sm font-serif">
              Inspiré des vagues et coquillages, ce complexe courbé semble surgi des fonds marins pour une expérience immersive face à l'horizon.
            </p>

          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im16.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>


        <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
          <h4 class="text-lg font-semibold text-green-600 font-serif">Résidence des Cimes</h4>
          <p class="mt-2 text-black-600 text-sm font-serif">
              📍 Atlanta
            </p>
            <p class="mt-2 text-black-600 text-sm font-serif">
              Perché à flanc de montagne, ce chef-d'œuvre contemporain offre une symbiose parfaite entre luxe minimaliste et panorama alpestre.           </p>
          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im14.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>


        <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
          <h4 class="text-lg font-semibold text-green-600 font-serif">Suite Americaine</h4>
          <p class="mt-2 text-black-600 text-sm font-serif">
              📍 Ile Canaris
            </p>

            <p class="mt-2 text-black-600 text-sm font-serif">
              Un écrin de verre et de bois niché dans les paysages nordiques, où l'architecture épurée épouse la nature sauvage.         </p>

          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im9.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>

        <div class="flex-shrink-0 w-[150px] w-1/2 p-4 flex flex-col justify-center font-serif">
      <a href="/chambres" class="inline-flex items-center text-green-600 text-lg font-semibold hover:underline hover:text-green-900 transition">
        Voir plus <span class="ml-2">→</span>
      </a>
    </div>

    </div>
  </div>
</section>


<section class="py-16 bg-white">
  <h3 class="text-2xl md:text-3xl text-center text-green-600 mb-10 font-serif">
    Des chambres de luxe 🛏
  </h3>

  <div class="relative max-w-6xl mx-auto px-4">
    <div class="flex overflow-x-auto scrollbar-hide space-x-6 pb-4">
      
      <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
            <h4 class="text-lg font-semibold text-green-600 font-serif">Suite Parisienne</h4>
            <p class="mt-2 text-black-600 text-sm font-serif">
              📍 Paris, France
            </p> 

            <p class="mt-2 text-black-600 text-sm font-serif">
              🛏 Lit 2 deux places
            </p>

            <p class="mt-2 text-black-600 text-sm font-serif">
              🛁  Une salle de bain
            </p>
          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im2.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>


        <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
          <h4 class="text-lg font-semibold text-green-600 font-serif">Suite Anglaise</h4>
            <p class="mt-2 text-black-600 text-sm font-serif">
              📍 Londres, Angleterre
            </p> 

            <p class="mt-2 text-black-600 text-sm font-serif">
              🛏 Lit 2 deux places
            </p>

            <p class="mt-2 text-black-600 text-sm font-serif">
              🛁 Une salle de bain
            </p>
          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im12.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>


        <div class="flex-shrink-0 w-[600px] h-48 bg-gray-50 rounded-lg shadow-md flex overflow-hidden">
        <div class="w-1/2 p-4 flex flex-col justify-center">
          <h4 class="text-lg font-semibold text-green-600 font-serif">Suite Americaine</h4>
            <p class="mt-2 text-black-600 text-sm font-serif">
              📍 New York, USA
            </p> 

            <p class="mt-2 text-black-600 text-sm font-serif">
              🛏 Lit 2 deux places
            </p>

            <p class="mt-2 text-black-600 text-sm font-serif">
              🛁 Une salle de bain
            </p>
          </div>
            <div class="w-1/2 h-full">
            <img src="/image/im13.jpg" alt="Palais Méditerranéen" class="w-full h-full object-cover">
          </div>
        </div>

        <div class="flex-shrink-0 w-[150px] w-1/2 p-4 flex flex-col justify-center font-serif">
      <a href="/chambres" class="inline-flex items-center text-green-600 text-lg font-semibold hover:underline hover:text-green-900 transition">
        Voir plus <span class="ml-2">→</span>
      </a>
    </div>

    </div>
  </div>
</section>
  </div>

  </template>
  
  <script>
import axios from 'axios';  
import flatpickr from 'flatpickr';
import 'flatpickr/dist/l10n/fr'; 
import 'flatpickr/dist/flatpickr.min.css';


  export default {
    name: "AcceuilVue",
 


  data() {
    return {
      currentImage: 0,
      images: [
        "/image/im3.jpg",
        "/image/im11.jpg",
        "/image/im7.jpg",
      ],
      checkinDate: null,
      checkoutDate: null
    };
  },
  mounted() {
    const checkoutPicker = flatpickr(this.$refs.checkoutInput, {
      locale: 'fr',
      minDate: new Date().fp_incr(1),
      dateFormat: 'd/m/Y',
      onChange: (selectedDates, dateStr) => {
        this.checkoutDate = dateStr;
      }
    });

    flatpickr(this.$refs.checkinInput, {
      locale: 'fr',
      minDate: 'today',
      dateFormat: 'd/m/Y',
      onChange: (selectedDates, dateStr) => {
        this.checkinDate = dateStr;
        checkoutPicker.set('minDate', selectedDates[0].fp_incr(1));
      }
    });
  },
  methods: {
    
    async searchRooms() {
    function convertToDateFormat(date) {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }
      try {
        

        const response = await axios.post('/search_chambres', {
          start_date:convertToDateFormat( this.checkinDate),
          end_date: convertToDateFormat(this.checkoutDate)
        });
      this.rooms = response.data;

      this.$router.push({
      name: 'chambres', 
      query: {
        rooms: JSON.stringify(this.rooms)

      }
    });
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        alert("Erreur lors de la recherche de chambres.");
      }
    },
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.images.length;
    },
    prevImage() {
      this.currentImage = (this.currentImage - 1 + this.images.length) % this.images.length;
    }
  }
};
  </script>
  
  <style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>