function r(r,n="children"){const a=[];function c(r){const{[n]:o,...s}=r;a.push(s),r[n]&&Array.isArray(r[n])&&r[n].forEach(c)}return Array.isArray(r)?r.forEach(c):r&&c(r),a}export{r as f};
