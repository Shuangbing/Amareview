
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>注文数</span>
          </div>
          <div class="text item">{{items.orderSUM}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>返金待ち注文数</span>
          </div>
          <div class="text item">{{items.waitRefund_SUM}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>返金待ち金額(JPY)</span>
          </div>

          <div class="textPrice item">
            <i class="el-icon-money"></i>
            {{items.orderRefundJPY}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>返金待ち金額(CNY)</span>
          </div>
          <div class="textPrice item">
            <i class="el-icon-money"></i>
            {{items.orderRefundCNY}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 10px;">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>実績注文</span>
          </div>
          <div class="text item">{{items.Paying_SUM}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>予定給料</span>
          </div>
          <div class="text item">{{parseInt(items.PayingRefundJPY*0.7/2)}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>返金合計(JPY)</span>
          </div>

          <div class="textPrice item">
            <i class="el-icon-money"></i>
            {{items.PayingRefundJPY}}
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>レート</span>
          </div>
          <div class="textPrice item">
            <i class="el-icon-money"></i>
            100JPY={{100*items.rate}}CNY
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-card class="box-card" style="margin-top: 15px; margin-right: 15px;">
          <div slot="header" class="clearfix">
            <span>注文数</span>
          </div>
          <div>
            <chart ref="chart1" style="width: 100%;" :options="totalOrderCount" :auto-resize="true"></chart>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="box-card" style="margin-top: 15px;">
          <div slot="header" class="clearfix">
            <span>注文金額</span>
          </div>
          <div>
            <chart ref="chart2" style="width: 100%;" :options="totalOrderPrice" :auto-resize="true"></chart>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      totalOrderCount: {},
      totalOrderPrice: {}
    };
  },
  methods: {
    async fetch() {
      const res = await this.$http.get("/api/dashboard");
      this.items = res.data.data;
      (this.totalOrderCount = {
        color: ["#3398DB"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            data: this.items.WeekTotal.map(i => {
              return i._id;
            }),
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "注文数",
            type: "bar",
            barWidth: "60%",
            data: this.items.WeekTotal.map(i => {
              return i.totalCount;
            })
          }
        ]
      }),
        (this.totalOrderPrice = {
          color: ["#3398DB"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "line"
            }
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: this.items.WeekTotal.map(i => {
                return i._id;
              }),
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              name: "注文金額(JPY)",
              type: "line",
              data: this.items.WeekTotal.map(i => {
                return i.totalPrice;
              })
            }
          ]
        });
    }
  },
  created() {
    this.fetch();
  }
};
</script>

<style>
.text {
  font-size: 2rem;
}
.textPrice {
  font-size: 1.5rem;
}

.item {
  margin-bottom: 1vh;
  height: 5vh;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>