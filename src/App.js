import intl from "react-intl-universal";
import _ from "lodash";
import axios from "axios";
import { hot } from "react-hot-loader";
import React, { Component } from "react";
import PluralComponent from "./Plural";
import BasicComponent from "./Basic";
import HtmlComponent from "./Html";
import DateComponent from "./Date";
import CurrencyComponent from "./Currency";
import MessageNotInComponent from "./MessageNotInComponent";
import "./App.css";

const SUPPOER_LOCALES = [
  {
    name: "English",
    value: "en-US",
  },
  {
    name: "简体中文",
    value: "zh-CN",
  },
  {
    name: "繁體中文",
    value: "zh-TW",
  },
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { initDone: false };
  }

  componentDidMount() {
    this.loadLocales();
  }

  render() {
    return (
      this.state.initDone && (
        <div>
          {this.renderLocaleSelector()}
          <BasicComponent />
          <PluralComponent />
          <HtmlComponent />
          <DateComponent />
          <CurrencyComponent />
          <MessageNotInComponent />
        </div>
      )
    );
  }

  loadLocales() {
    let currentLocale = intl.determineLocale({
      urlLocaleKey: "lang",
      cookieLocaleKey: "lang",
    });

    console.log(currentLocale);

    // 如果没找到，则默认为汉语
    if (!_.find(SUPPOER_LOCALES, { value: currentLocale })) {
      currentLocale = "zh-CN";
    }

    axios
      .get(`locales/${currentLocale}.json`)
      .then((res) => {
        console.log("App locale data", res.data);
        // init 方法将根据 currentLocale 来加载当前语言环境的数据
        return intl.init({
          currentLocale,
          locales: {
            [currentLocale]: res.data,
          },
        });
      })
      .then(() => {
        // After loading CLDR locale data, start to render
        this.setState({ initDone: true });
      });
  }

  renderLocaleSelector() {
    return (
      <select onChange={this.onSelectLocale} defaultValue="">
        <option value="" disabled>
          Change Language
        </option>
        {SUPPOER_LOCALES.map((locale) => (
          <option key={locale.value} value={locale.value}>
            {locale.name}
          </option>
        ))}
      </select>
    );
  }

  onSelectLocale(e) {
    let lang = e.target.value;
    window.location.search = `?lang=${lang}`;
  }
}

export default hot(module)(App);
