<template functional>
  <svg
    :width="props.size"
    :height="props.size"
    version="1.1"
    id="Ebene_3"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    x="0px"
    y="0px"
    viewBox="0 0 72 72"
    enable-background="new 0 0 72 72"
    xml:space="preserve"
  >
    <g>
      <path
        fill="none"
        :stroke="props.color"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        d="
		M32.9,46H16c-1.1,0-2-0.9-2-2v-6.8c0-1.1,0.9-2,2-2h40c1.1,0,2,0.9,2,2V44c0,1.1-0.9,2-2,2H39.2"
      />
      <g>
        <path
          fill="none"
          :stroke="props.color"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-miterlimit="10"
          d="
			M32.9,46H15c-1.1,0-2,0.9-2,2v6c0,1.1,0.9,2,2,2h42c1.1,0,2-0.9,2-2v-6c0-1.1-0.9-2-2-2H39.2"
        />
      </g>
      <path
        fill="none"
        :stroke="props.color"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        d="
		M59,33.2c0,1.1-0.9,2-2,2H15c-1.1,0-2-0.9-2-2C14.5,21.8,24.2,13,36,13S57.5,21.8,59,33.2z"
      />

      <polygon
        fill="none"
        :stroke="props.color"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-miterlimit="10"
        points="
		49.9,35.2 22.1,35.2 36,49.2 	"
      />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'IconHamburger',
  props: {
    size: {
      type: String,
      default: '16'
    },
    color: {
      type: String,
      default: 'white'
    }
  }
}
</script>
