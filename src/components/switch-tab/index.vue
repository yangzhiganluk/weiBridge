<template>
    <div>
        <!-- 桥梁名称 -->
        <div class="bridge-name">
            <divider>{{bridgeInfo.fullname}}</divider>
        </div>
        <div class="space_20"></div>
        <grid class="switch-tab" :show-lr-borders="false">
            <grid-item link="/BridgeState">
                <img slot="icon" :src="iconState">
                <span slot="label" :style="{color: stateFlag ? '#6DDDD1' : '#000'}">状态</span>
            </grid-item>
            <grid-item link="/Devices">
                <img slot="icon" :src="iconDevices">
                <span slot="label" :style="{color: devicesFlag ? '#6DDDD1' : '#000'}">设备</span>
            </grid-item>
            <grid-item link="/Alarms">
                <img slot="icon" :src="iconAlarms">
                <span slot="label" :style="{color: alarmsFlag ? '#6DDDD1' : '#000'}">告警</span>
            </grid-item>
        </grid>
    </div>
</template>

<script>
export default {
    props: {
        bridgeInfo: {
            type: Object,
            default: undefined,
            required: true
        }
    },
    data() {
        return {
            stateFlag: false,
            devicesFlag: false,
            alarmsFlag: false,
        }
    },
    computed: {
        iconState: function() {
            return this.stateFlag ? require('assets/images/icon/icon_statistics.png') : require('assets/images/icon/icon_statistics_Dark.png')
        },
        iconDevices: function() {
            return this.devicesFlag ? require('assets/images/icon/icon_bridge.png') : require('assets/images/icon/icon_bridge_Dark.png')
        },
        iconAlarms: function() {
            return this.alarmsFlag ? require('assets/images/icon/icon_alarm.png') : require('assets/images/icon/icon_alarm_Dark.png')
        }
    },
    created() {
        let routename = this.$route.name;
        switch(routename) {
            case 'BridgeState' : 
                this.stateFlag = true;
                this.devicesFlag = false;
                this.alarmsFlag = false;
                break;
            case 'Devices' : 
                this.stateFlag = false;
                this.devicesFlag = true;
                this.alarmsFlag = false;
                break;
            case 'Alarms' : 
                this.stateFlag = false;
                this.devicesFlag = false;
                this.alarmsFlag = true;
                break;
        }
    },
    methods:{
       
    }
};
</script>

<style scoped lang="scss">
    
    .switch-tab {
        margin: 0 auto 20px;
        background-color: #fff;
        .weui-grid {
            padding-top: 15px;
            padding-bottom: 15px;
        }
        // &:before,
        // &:after {
        //     display: none;
        // }
    }
</style>
