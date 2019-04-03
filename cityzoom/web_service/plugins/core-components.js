import Vue from 'vue'
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import LoginForm from "@/components/Login";
import SeriesGraph from "@/components/UI/Graphs/Series"
import StackedBar from "@/components/UI/Graphs/Columns"


Vue.component("Navbar", Navbar);
Vue.component("Header", Header);
Vue.component("LoginForm", LoginForm);
Vue.component("SeriesGraph", SeriesGraph);
Vue.component("StackedBar", StackedBar);