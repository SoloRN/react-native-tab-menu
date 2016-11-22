import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

//设定内置的属性
//选中项，例如：_type_0_2 表示第一个Tab选中，并且第二个Tab中的第三项选中
var prefixType = '_type_';

//选中项样式，例如：_style_0_2 表示第一个Tab选中，并且第二个Tab中的第三项选中时的样式
var prefixStyle = '_style_';

//默认左侧选中的背景颜色
var defaultBackgroundColor = {backgroundColor:'#fff',color:'#4DB8C8'};
//默认右侧选中的背景颜色
var defaultRightBackgroundColor = {backgroundColor:'#4DB8C8',color:'white'};

var MenuList = React.createClass({
  getInitialState: function(){
    var data = this.props.data;
    //左侧选择的index
    var nSelected = this.props.nSelected;
    //右侧选择的index
    var rightSelected = this.props.rightSelected;
    //头部选择的index
    var tabSelected = this.props.tabSelected;
    var obj = {};
    var kIndex = 0;
    for(var k in data){
      var childData = data[k];
      var cIndex = 0;
      for(var c in childData){
        var type = prefixType + k + '_' + c;
        var style = prefixStyle + k + '_' + c;
        obj[type] = false;
        obj[style] = {};
        //设定默认选中项
        if(nSelected === cIndex && tabSelected === kIndex ){
          obj[type] = true;
          obj[style] = defaultBackgroundColor;
        }
        cIndex++;
      }
      kIndex++;
    }
    obj.tabSelected = tabSelected;
    obj.nSelected = nSelected;
    obj.rightSelected = rightSelected;
    return obj;
  },
  render: function(){
    var header = this.renderlHeader();
    var left = this.renderLeft();
    var right = this.renderRight();
    return (
      <View style={styles.container}>
        <View style={[styles.row, styles.header]}>
          {header}
        </View>
        <View style={[styles.row, styles.flex_1]}>
          <ScrollView style={[styles.flex_1, styles.left_pannel]}>
            {left}
          </ScrollView>
          <ScrollView style={[styles.flex_1, styles.right_pannel]}>
            {right}
          </ScrollView>

        </View>
      </View>
    );
  },

  //渲染头部TabBar
  renderlHeader: function(){
    var data = this.props.data;
    var tabSelected = this.state.tabSelected;
    var header = [];
    var tabIndex = 0;
    for(var i in data){
      var tabStyle = null;
      if(tabIndex === tabSelected){
        // tabStyle=[styles.header_text, styles.active_blue];
        tabStyle = [styles.header_text];
      }else{
        tabStyle = [styles.header_text];
      }
      header.push(
        // {/*<TouchableOpacity style={[styles.flex_1, styles.center]}*/}
        //                   {/*onPress={this.headerPress.bind(this, i)}>*/}
        //   {/*<Text style={tabStyle}>{i}</Text>*/}
        // {/*</TouchableOpacity>*/}
          <View style={[styles.flex_1, styles.center]}>
            <Text style={tabStyle}>{i}</Text>
          </View>
      );
      tabIndex ++;
    }
    return header;
  },

  //渲染左侧
  renderLeft: function(){
    var data = this.props.data;
    var tabSelected = this.state.tabSelected;
    var leftPannel = [];
    var index = 0;
    for(var i in data){
      if(index === tabSelected){
        for(var k in data[i]){
          var style = this.state[prefixStyle + i + '_' + k];
          leftPannel.push(
            <Text onPress={this.leftPress.bind(this, i, k)}
                  style={[styles.left_row, style]}>  {k}</Text>);
        }
        break;
      }
      index ++;
    }
    return leftPannel;
  },
  //渲染右边，二级菜单
  renderRight: function(){
    var data = this.props.data;
    var tabSelected = this.state.tabSelected;
    var nSelected = this.state.nSelected;
    var rightSelected = this.state.rightSelected;
    var index = 0;
    var rightPannel = [];
    for(var i in data){
      if(tabSelected === index ){
        for(var k in data[i]){
          if(this.state[prefixType + i + '_' + k]){
            for(var j in data[i][k]){

              var style = j === rightSelected ? defaultRightBackgroundColor : null;
              rightPannel.push(
                <Text onPress={this.rightPress.bind(this,i,k,j)}
                      style={[styles.left_row,style]}>{data[i][k][j]}
                </Text>
              );
            }
            break;
          }
        }
      }
      index ++;
    }
    return rightPannel;
  },
  //点击右侧
  rightPress:function (i,k,j) {
    this.props.click(k,this.props.data[i][k][j]);
    this.setState({rightSelected:j})
  },
  //点击左侧，展示右侧二级菜单
  leftPress: function(tabIndex, nIndex){
    var obj = {};
    for(var k in this.state){
      //将prefixType或者prefixStyle类型全部置false
      if(k.indexOf(prefixType) > -1){
        var obj = {};
        obj[k] = false;
        this.setState(obj);
      }
      if(k.indexOf(prefixStyle) > -1){
        var obj = {};
        obj[k] = {};
        this.setState(obj);
      }
    }
    obj[prefixType + tabIndex + '_' + nIndex] = true;
    obj[prefixStyle + tabIndex + '_' + nIndex] = defaultBackgroundColor;
    obj['rightSelected'] = 0;//重置右边选择
    this.setState(obj);
  },
  //头部点击事件即Tab切换事件
  headerPress: function(title){
    var data = this.props.data;
    var index = 0;
    for(var i in data){
      if(i === title){
        this.setState({
          tabSelected: index,
        });
        var obj = {};
        var n = 0;
        for(var k in data[i]){
          if(n !== 0){
            obj[prefixType + i + '_' + k] = false;
            obj[prefixStyle + i + '_' + k] = {};
          }else{
            obj[prefixType + i + '_' + k] = true;
            obj[prefixStyle + i + '_' + k] = defaultBackgroundColor;
          }
          n ++;
        }
        this.setState(obj);
      }
      index ++;
    }
  }
});

var styles = StyleSheet.create({
  container:{
    height:250,
    marginTop:20,
    marginLeft:20,
    marginRight:20,
    borderRadius:10,
    overflow:'hidden',
  },
  row:{
    flexDirection: 'row'
  },
  flex_1:{
    flex:1
  },
  header:{
    height:40,
    borderBottomWidth:1,
    borderColor:'#DFDFDF',
    backgroundColor:'#F5F5F5'
  },
  header_text:{
    color:'#7B7B7B',
    fontSize:15
  },
  center:{
    justifyContent:'center',
    alignItems:'center'
  },
  left_pannel:{
    backgroundColor:'#F2F2F2',
  },
  left_row:{
    height:40,
    lineHeight:40,
    fontSize:15,
    color:'#666666',
    textAlign:'center',
  },
  right_pannel:{
    backgroundColor:'white',
  },
  active_blue:{
    color: '#00B7EB'
  },
  active_fff:{
    backgroundColor:'#fff'
  }
});

module.exports = MenuList;




