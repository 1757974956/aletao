$(function () {
    //1.导入ECharts插件
    //2.画柱状图
    barCharts();
    //3.画饼状图
    picCharts();
    
})
var barCharts = function () {
    //模拟后台数据
    var data = [
        {name:'一月', value:'300'},
        {name:'二月', value:'400'},
        {name:'三月', value:'200'},
        {name:'四月', value:'500'},
        {name:'五月', value:'600'}
    ]
    //把数据分成两个,存储数组里
    var xData = [];
    var yData = [];
    data.forEach(function (item, i) {
        xData.push(item.name);
        yData.push(item.value);
    })
    console.log(xData)
    console.log(yData)

    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('first'));

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '2019注册人数'
        },
        //悬浮上去提示的内容
        tooltip: {},
        //配置柱状图的说明
        legend: {
            data:['注册人数']
        },
        //x轴显示的内容
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '注册人数',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };
    //重新赋值
    option.xAxis.data = xData;
    option.series[0].data = yData;

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}

var picCharts = function () {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('second'));

    // 指定图表的配置项和数据
    var option = {
        title : {
            text: '品牌销售占比',
            subtext: '2019年3月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['安踏','李宁','阿迪','匡威','耐克']
        },
        series : [
            {
                name: '数据',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'安踏'},
                    {value:310, name:'李宁'},
                    {value:234, name:'阿迪'},
                    {value:135, name:'匡威'},
                    {value:548, name:'耐克'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}