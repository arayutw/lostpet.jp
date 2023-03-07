// カラーテーマの反映
var t = localStorage.getItem("t");

if ("2" === t || ("1" !== t && matchMedia("(prefers-color-scheme:dark)").matches)) {
    document.documentElement.classList.replace("t1", "t2");
}

// 視差効果の反映
var t = localStorage.getItem("r");

if ("2" === t || ("1" !== t && matchMedia("(prefers-reduced-motion)").matches)) {
    document.documentElement.classList.add("r2");
}

document.currentScript.remove();