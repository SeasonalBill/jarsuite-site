(function () {
  var toggle = document.querySelector(".nav-toggle");
  var row = document.querySelector(".header-row");
  if (toggle && row) {
    toggle.addEventListener("click", function () {
      var open = row.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!row.contains(e.target) && !toggle.contains(e.target)) {
        row.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  var params = new URLSearchParams(window.location.search);
  var product = params.get("product");
  if (product) {
    var box = document.querySelector('input[name="products"][value="' + product + '"]');
    if (box) box.checked = true;
  }

  // Without JavaScript the form posts straight to FormSubmit and lands on thanks.html.
  var form = document.querySelector("form.inquire");
  if (!form || !window.fetch) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var data = {};
    new FormData(form).forEach(function (v, k) {
      data[k] = data[k] ? data[k] + ", " + v : v;
    });
    button.disabled = true;
    fetch(form.getAttribute("data-ajax"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && String(res.j.success) !== "false") {
          window.location.href = "thanks.html";
        } else { throw new Error(res.j.message || "failed"); }
      })
      .catch(function () {
        status.textContent = "Sorry, that did not send. Please try again in a minute.";
        status.classList.add("show", "error");
        button.disabled = false;
        status.focus();
      });
  });
})();
