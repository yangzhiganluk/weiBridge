import switchTab from '@/components/switch-tab'
import ViewCard1 from '@/components/bridge-state-card/viewcard1/viewcard1.vue'
import ViewCard2 from '@/components/bridge-state-card/viewcard2/viewcard2.vue'
import ViewCard3 from '@/components/bridge-state-card/viewcard3/viewcard3.vue'
import ViewCard4 from '@/components/bridge-state-card/viewcard4/viewcard4.vue'
import ViewCard5 from '@/components/bridge-state-card/viewcard5/viewcard5.vue'
import ViewCard6 from '@/components/bridge-state-card/viewcard6/viewcard6.vue'
import ViewCard7 from '@/components/bridge-state-card/viewcard7/viewcard7.vue'
import ViewCard8 from '@/components/bridge-state-card/viewcard8/viewcard8.vue'
import ViewCard9 from '@/components/bridge-state-card/viewcard9/viewcard9.vue'
import ViewCard10 from '@/components/bridge-state-card/viewcard10/viewcard10.vue'
import ViewCard12 from '@/components/bridge-state-card/viewcard12/viewcard12.vue'
import ViewCard13 from '@/components/bridge-state-card/viewcard13/viewcard13.vue'
import api from '@/api'
export default {
    props: {

    },
    data() {
        return {
            bridgeInfo: localStorage.getItem("bridgeInfo") ? JSON.parse(localStorage.getItem("bridgeInfo")) : [],
            projectViewCard: [],//项目可用的视图卡
        };
    },
    mounted() {
        this.getAllViewCardByStructure()
    },
    methods: {
        getAllViewCardByStructure() {
            let scope = this;
            scope.$http.get( `${api.management_url}/viewcard/getAllViewCardByStructure`, {
                params: {
                    scode: scope.bridgeInfo.code
                }
            }).then((res) => {
                let resData = res.data
                if (resData.resultCode == 1) {
                    if(resData.data && resData.data.length>0){
                        let data = resData.data;
                        data.forEach((el, i) => {
                            let vcode = el.vcode
                            switch(vcode) {
                                case 'V001': data[i].cardname = 'ViewCard1'; break;
                                case 'V002': data[i].cardname = 'ViewCard2'; break;
                                case 'V003': data[i].cardname = 'ViewCard3'; break;
                                case 'V004': data[i].cardname = 'ViewCard4'; break;
                                case 'V005': data[i].cardname = 'ViewCard5'; break;
                                case 'V006': data[i].cardname = 'ViewCard6'; break;
                                case 'V007': data[i].cardname = 'ViewCard7'; break;
                                case 'V008': data[i].cardname = 'ViewCard8'; break;
                                case 'V009': data[i].cardname = 'ViewCard9'; break;
                                case 'V010': data[i].cardname = 'ViewCard10'; break;
                                case 'V011': data[i].cardname = 'ViewCard11'; break;
                                case 'V012': data[i].cardname = 'ViewCard12'; break;
                                case 'V013': data[i].cardname = 'ViewCard13'; break;
                            }
                        });
                        this.projectViewCard = data;
                    }
                } else {
                    scope.$vux.toast.text(resData.msg);
                }
            })
        }
    },
    components: {
        switchTab,
        ViewCard1,
        ViewCard2,
        ViewCard3,
        ViewCard4,
        ViewCard5,
        ViewCard6,
        ViewCard7,
        ViewCard8,
        ViewCard9,
        ViewCard10,
        ViewCard12,
        ViewCard13,
    }
};