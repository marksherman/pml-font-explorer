<!-- Contributed by David Bau, in the public domain -->

<template>
  <div class="vectorlist">
    <div v-for="(vector, index) in vectors" class="vector">
      <input v-model="vector.text" />
      <button @click="selectVector(index)">&rarr;</button>
      <button @click="deleteVector(index)">x</button>
    </div>
    <div class="operation">
      <button @click="saveVector()">Save current sample</button>
    </div>
    <div class="operation">
      <button @click="getKNN()">Nearest neighbor: {{ nearestNeighbor }}</button>
    </div>
    <div class="operation">
      <button @click="findAverageFont()">Find average font</button>
    </div>
    <div class="operation">
      <button @click="applyVectorMath()">Apply vector math</button>
    </div>
    <div class="operation">
      <button @click="applyCustom()">Apply custom vector</button>
    </div>
  </div>
</template>

<script>
import { Array1D, ENV } from "deeplearn";

const math = ENV.math;

//This json file includes all of the Font IDs in our database and their 40-dimensional logits vector.
var allFonts = require("../embeddings.json");

export default {
  props: {
    selectedSample: {},
    model: {},
    vectors: { type: Array, default: () => [{ text: "0" }] },
  },
  data: () => {
    return {
      nearestNeighbor: "",
    };
  },
  methods: {
    saveVector() {
      this.selectedSample
        .data()
        .then((x) =>
          this.vectors.push({ text: Array.prototype.slice.call(x).join(",") })
        );
    },
    deleteVector(index) {
      this.vectors.splice(index, 1);
    },
    selectVector(index) {
      this.$emit("select", {
        selectedSample: this.model.fixdim(
          Array1D.new(this.vectors[index].text.split(",").map(parseFloat))
        ),
      });
    },
    dotProduct(vecA, vecB) {
      let product = 0;
      for (let i = 0; i < vecA.length; i++) {
        product += vecA[i] * vecB[i];
      }
      return product;
    },
    magnitude(vec) {
      let sum = 0;
      for (let i = 0; i < vec.length; i++) {
        sum += vec[i] * vec[i];
      }
      return Math.sqrt(sum);
    },
    cosineSimilarity(vecA, vecB) {
      return Math.abs(
        this.dotProduct(vecA, vecB) /
          (this.magnitude(vecA) * this.magnitude(vecB))
      );
    },
    findNearestNeighbor(fontA) {
      // TODO: Problem 3

      // GOAL:    Find the font from the data set that's closest to the current font.
      //          The current font (in the viewer) will be passed in as fontA.
      // RETURNS: The id of the font that is most similar fontA.

      // TOOLS: this.consineSimilarity(vecA, vecB) -> returns the similarity as a number
      // DATA:  allFonts, an array containing all of the known fonts

      // what to do: go through all the fonts in the allFonts list, and find the one
      //  with the best cosine similarity to the current font, and return its index.

      console.log(this.cosineSimilarity(fontA, fontA)); // checks similarity of fontA to itself. Should print 0.9999999999999999.
      return -1;
    },
    findAverageFont() {
      // TODO: Problem 4

      // GOALS:   1. Find the "average font" among all the fonts in allFonts list.
      //          2. Find the nearest neighbor to that average font.

      // TOOLS: you already wrote this.findNearestNeighbor(fontA)
      // DATA:  allFonts, an array containing all of the known fonts

      // what to do: go through all the fonts in the allFonts list, build a summation of each of
      //  the 40 properties, and then divide all of those to create a vector of average aspects.

      console.log("I don't know how to find the average font yet.");
    },
    applyVectorMath() {
      // TODO: Problem 5
      let boldingVector = "0.053,0.026,-0.060,-0.014,-0.093,-0.018,0.087,0.096,-0.039,0.071,0.111,-0.022,-0.007,0.022,-0.032,0.141,0.126,-0.015,-0.075,0.120,0.068,0.021,0.104,-0.065,-0.085,-0.018,-0.038,-0.059,-0.051,-0.056,0.154,-0.044,-0.116,0.038,-0.144,-0.103,-0.032,0.059,-0.076,-0.030";
      boldingVector = boldingVector.split(",");
      this.$emit("select", {
        selectedSample: math.add(
          this.selectedSample,
          this.model.fixdim(Array1D.new(boldingVector))
        ),
      });
    },
    applyCustom() {
      // TODO: Problem 6

      // you can define a vector a string, like this, and then use the .split function to turn it into an array.
      let customVector = "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0";
      customVector = customVector.split(",");
      // or you can define a vector directly as an array, like this. Both work.
      //customVector = [-0.03520352020859718, 0.02173503302037716, 0.01992262899875641, -0.00495204608887434, 0.04364948719739914, -0.01348003651946783, -0.01732528954744339, -0.030055854469537735, 0.09977856278419495, -0.045404836535453796, -0.014340694062411785, 0.04301835969090462, -0.00500490702688694, 0.01283679436892271, 0.056952327489852905, -0.08987335860729218, -0.06289001554250717, -0.02591700665652752, -0.016200939193367958, -0.07753050327301025, -0.06670749187469482, -0.16090990602970123, 0.016316642984747887, 0.07314751297235489, 0.13291411101818085, 0.07130863517522812, -0.03177357837557793, 0.02639533020555973, 0.007966434583067894, -0.013196081854403019, 0.02843403071165085, 0.02434488572180271, -0.06359650939702988, 0.016658520326018333, -0.0006383336149156094, 0.04270685091614723, 0.027090556919574738, -0.035502802580595016, -0.07372935116291046, -0.03581318259239197];

      // play around in here.

      this.$emit("select", {
        selectedSample: math.add(
          this.selectedSample,
          this.model.fixdim(Array1D.new(customVector))
        ),
      });
    },
    getKNN() {
      this.selectedSample.data().then((currentFont) => {
        this.nearestNeighbor = this.findNearestNeighbor(currentFont);
      });
    },
  },
  watch: {
    model: function () {
      for (let i = 0; i < this.vectors.length; ++i) {
        let arr = this.vectors[i].text.split(",");
        if (arr.length > this.model.dimensions) {
          arr = arr.slice(0, this.model.dimensions);
        }
        while (arr.length < this.model.dimensions) {
          arr.push("0");
        }
        this.vectors[i].text = arr.join(",");
      }
    },
  },
};
</script>

<style scoped>
.vector,
.operation {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}
</style>
