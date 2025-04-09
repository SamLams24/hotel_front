<template>
  <div>
    <!-- Police externe -->
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
    </head>

    <!-- Image de couverture -->
    <section class="relative">
      <img src="/image/rec.jpg" alt="Contact Us" class="w-full h-80 object-cover">
      <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <h1 class="text-white text-4xl font-serif">Contactez-nous</h1>
      </div>
    </section>

    <!-- Section formulaire + info -->
    <section class="py-16 bg-white">
      <div class="max-w-5xl mx-auto px-4">
        <h3 class="text-3xl text-center text-gray-800 mb-12 font-serif">Nous aimerions avoir de vos nouvelles</h3>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row font-serif">
          
          <!-- Formulaire -->
          <div class="md:w-2/4 p-8">
            <form action="#" method="POST" class="space-y-6">
              <div>
                <label for="name" class="block text-lg text-green-600">Nom</label>
                <input type="text" id="name" name="name" required class="w-full p-4 border border-gray-300 rounded-lg shadow-md">
              </div>
              <div>
                <label for="email" class="block text-lg text-green-600">Email</label>
                <input type="email" id="email" name="email" required class="w-full p-4 border border-gray-300 rounded-lg shadow-md">
              </div>
              <div>
                <label for="message" class="block text-lg text-green-600">Message</label>
                <textarea id="message" name="message" rows="5" required class="w-full p-4 border border-gray-300 rounded-lg shadow-md"></textarea>
              </div>
              <div class="text-center">
                <button type="submit" class="bg-green-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-800">Envoyer</button>
              </div>
            </form>
          </div>

          <!-- Info contact à droite -->
         <div class="md:w-2/4 relative bg-cover bg-center text-white p-8 space-y-6" style="background-image: url('/image/ile.jpg');">
          <div class="absolute inset-0 bg-black bg-opacity-30"></div> 

          <div class="relative z-10">
            
            <h4 class="text-5xl font-bold font-['Dancing_Script']">Hotel Booking</h4>

            <div class="mt-8">
  <h4 class="text-xl mb-3">Contact</h4>
  <p>Email : contact@hotelbook.com</p>
  <p>Téléphone : +228 90 12 34 56</p>
</div>

<div class="mt-10"> <!-- Espacement ajouté ici -->
  <h4 class="text-xl mb-3">Suivez-nous</h4>
  <div class="flex space-x-6">
    <a href="#"><img src="/image/face.png" alt="Facebook" class="h-8 w-8"></a>
    <a href="#"><img src="/image/tik.png" alt="TikTok" class="h-8 w-8"></a>
    <a href="#"><img src="/image/insta.png" alt="Instagram" class="h-8 w-8"></a>
  </div>
</div>


<div class="mt-10">
              <div>
                <h4 class="text-xl mb-3">Adresse</h4>
                <p>Rue de la Plage, Lomé, Togo</p>
              </div>
            </div>
          </div>
</div>
</div>
      </div>
    </section>

    <!-- Section Carte -->
    <section class="py-16 bg-gray-50 font-serif">
      <div class="text-center mb-8">
        <h3 class="text-2xl font-semibold text-gray-800">Nous trouver sur Google Maps</h3>
        <p class="text-gray-600 mt-2">Lomé, Togo</p>
      </div>

      <div class="w-full h-80">
        <iframe
          src="https://www.google.com/maps?q=Lomé,Togo&output=embed"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy">
        </iframe>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "ContactPage",
};
</script>

<style scoped>
/* Ajoute tes styles personnalisés ici si besoin */
</style>
