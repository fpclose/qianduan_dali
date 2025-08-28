# ISCTF 前后端分离项目

## 项目概述

ISCTF是一个CTF（Capture The Flag）竞赛平台，采用前后端分离架构。前端使用React + TypeScript + Tailwind CSS开发，后端API接口提供用户认证、题目管理、容器管理等功能。

## 前端技术栈

- React + TypeScript
- Tailwind CSS 用于样式
- Vite 作为构建工具
- React Router 用于路由管理
- Framer Motion 用于页面过渡动画
- Sonner 用于通知提示

## 后端API接口

### 用户认证相关接口

#### 登录
- **URL**: `http://106.55.236.121:8080/api/login`
- **方法**: POST
- **请求体**:
  ```json
  {
    "operate": "login",
    "message": {
      "username": "用户名",
      "password": "密码"
    }
  }
  ```
- **响应**:
  ```json
  {
    "message": {
      "start": true/false,
      "token": "认证令牌",
      "user_info": {
        "username": "用户名",
        "identity": "user/admin"
      }
    }
  }
  ```

#### 注册
- **URL**: `http://106.55.236.121:8080/api/register`
- **方法**: POST
- **获取验证码**:
  ```json
  {
    "operate": "register",
    "message": {
      "email": "邮箱地址",
      "request_type": "get_verify_code"
    }
  }
  ```
- **注册用户**:
  ```json
  {
    "operate": "register",
    "message": {
      "username": "用户名",
      "password": "密码",
      "email": "邮箱地址",
      "verify_code": "验证码",
      "request_type": "register"
    }
  }
  ```

#### 找回密码
- **URL**: `http://106.55.236.121:8080/api/register`
- **方法**: POST
- **请求体**:
  ```json
  {
    "operate": "register",
    "message": {
      "email": "邮箱地址",
      "request_type": "get_verify_code/reset_password",
      "verify_code": "验证码",
      "password": "新密码"
    }
  }
  ```

### 题目管理接口

#### 获取题目详情
- **URL**: `http://106.55.236.121:8080/api/user/challenge/information`
- **方法**: POST
- **请求体**:
  ```json
  {
    "token": "认证令牌",
    "operate": "user_challenge_information",
    "message": {
      "title": "分类",
      "title_son": "子分类",
      "challenge_name": "题目名称"
    }
  }
  ```

#### 提交Flag
- **URL**: `http://106.55.236.121:8080/api/user/challenge/submit`
- **方法**: POST
- **请求体**:
  ```json
  {
    "token": "认证令牌",
    "operate": "user_challenge_submit",
    "message": {
      "title": "分类",
      "title_son": "子分类",
      "challenge_name": "题目名称",
      "flag": "提交的flag"
    }
  }
  ```

### 容器管理接口

#### 启动容器
- **URL**: `http://106.55.236.121:8080/api/dynamic/container/add`
- **方法**: POST
- **请求体**:
  ```json
  {
    "token": "认证令牌",
    "message": {
      "title": "分类",
      "title_son": "子分类",
      "challenge_name": "题目名称"
    }
  }
  ```

#### 停止容器
- **URL**: `http://106.55.236.121:8080/api/dynamic/container/reduce`
- **方法**: POST
- **请求体**:
  ```json
  {
    "token": "认证令牌",
    "message": {
      "title": "分类",
      "title_son": "子分类",
      "challenge_name": "题目名称"
    }
  }
  ```

#### 延长容器时间
- **URL**: `http://106.55.236.121:8080/api/dynamic/container/time`
- **方法**: POST
- **请求体**:
  ```json
  {
    "token": "认证令牌",
    "message": {
      "title": "分类",
      "title_son": "子分类",
      "challenge_name": "题目名称"
    }
  }
  ```

### 管理员接口

#### 获取用户列表
- **URL**: `http://106.55.236.121:8080/api/admin/select`
- **方法**: POST
- **请求体**:
  ```json
  {
    "token": "认证令牌",
    "operate": "select_users",
    "message": {
      "page": 1,
      "limit": 10,
      "search_username": "搜索用户名",
      "search_email": "搜索邮箱",
      "search_identity": "搜索身份",
      "sort_by": "排序字段",
      "sort_order": "排序方式"
    }
  }
  ```

#### 删除用户
- **URL**: `http://106.55.236.121:8080/api/admin/user/delete`
- **方法**: POST
- **请求体**:
  ```json
  {
    "token": "认证令牌",
    "operate": "delete_user",
    "message": {
      "email": "用户邮箱"
    }
  }
  ```

## 前端页面功能

1. **首页**: 展示平台介绍和导航
2. **登录页**: 用户登录
3. **注册页**: 新用户注册
4. **找回密码页**: 用户找回密码
5. **练习场**: 
   - 展示不同分类的题目
   - 题目详情查看
   - 启动/停止动态容器
   - 提交flag
6. **ISCTF页**: CTF竞赛相关内容
7. **社区页**: 用户交流社区
8. **竞赛页**: 展示竞赛信息
9. **管理员面板**:
   - 用户管理：添加、编辑、删除用户
   - 系统设置：配置系统参数
   - ISCTF管理：管理CTF赛事
   - 练习场管理：管理练习题目

## 认证机制

系统使用基于Token的认证机制：
1. 用户登录成功后获取token
2. token存储在localStorage中
3. 后续请求需要在请求体中包含token
4. 管理员权限通过identity字段区分