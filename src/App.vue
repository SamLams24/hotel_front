<template>
  <head>
     <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap" rel="stylesheet">
   </head>

   
  
    <Navbar />
  
    <FooterVue/>




</template>

<script>

import Navbar from './views/NavbarComponent.vue';

import FooterVue from './views/BasBar.vue';



export default {

  components: {
    Navbar,
    FooterVue
   
  },

  name: "HomePage"
};
  
  
</script>

