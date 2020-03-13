import switchTab from '@/components/switch-tab'
export default {
    props: {

    },
    data() {
        return {
            bridgeInfo: localStorage.getItem("bridgeInfo") ? JSON.parse(localStorage.getItem("bridgeInfo")) : [],
        };
    },
    computed: {

    },
    created() {
        
    },
    mounted() {
    },
    watch: {

    },
    methods: {
        
    },
    components: {
        switchTab
    },
};