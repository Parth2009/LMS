$(".togglePassword").on("click", function () {
  let pass = $(this).parent(".input-group").find("input");
  if (pass.attr("type") == "password") {
    pass.attr("type", "text");
    $(this).html('<i class="fa-regular fa-eye-slash"></i>');
  } else {
    pass.attr("type", "password");
    $(this).html('<i class="fa-regular fa-eye"></i>');
  }
});

$(document).ready(function () {
  // $.ajaxSetup({
  // 	headers: {
  // 		'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
  // 	}
  // });

  $("body").on("click", 'a[data-bs-toggle="modal"]', function () {
    $($(this).data("bs-target") + " .modal-dialog").load($(this).attr("href"));
  });

  // $('[data-bs-toggle="tooltip"]').tooltip();

  //universal ajax submit function
  $(document).on("click", ".ajax-submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var submit_btn = $(this);
    var btn_name = $(this).html();
    var new_btn_name = "Loading...";
    var form = $(this).parents("form:first");
    var method = $(form).attr("method");
    var url = $(form).attr("action");

    if (
      $('input[name="button_action"]').length == 1 &&
      $(this).val() != "" &&
      $(this).val() != undefined
    ) {
      $('input[name="button_action"]').val($(this).val());
    }

    $(form).ajaxSubmit({
      type: method,
      url: url,
      dataType: "JSON",
      beforeSend: function () {
        $(submit_btn).html(new_btn_name);
        $(submit_btn).attr("disabled", true);
        $(form).find(".form-group").removeClass("has-error");
        $(form).find(".help-block").remove();

        $(document).find("#invoice-created").hide();
      },
      success: function (data) {
        if (data.status == 1) {
          if (data.redirect_url) {
            window.open(data.redirect_url, "_blank");
          }

          if (data.reload_url) {
            setTimeout(function () {
              window.location.reload();
            }, 3500);
          }

          $(submit_btn).attr("disabled", true);

          if (data.close_modal && data.close_modal == true) {
            $("#" + data.modal_id)
              .find(".modal-body")
              .html(data);
            $("#" + data.modal_id).modal("hide");
          }

          if (data.type == "toast") {
            Toast.fire({ icon: "success", title: data.msg });

            if (data.redirect && data.redirect != "undefined") {
              setTimeout(function () {
                location.replace(data.redirect);
              }, 2000);
            } else if (data.triggerclick && data.triggerclick != "undefined") {
              setTimeout(function () {
                $(document)
                  .find("." + data.triggerclick)
                  .trigger("click");
              }, 2000);
            } else if (typeof data.refresh != "undefined") {
              setTimeout(function () {
                location.reload();
              }, 2000);
            }
          } else {
            swal({
              title: "Done",
              text: data.msg,
              type: "success",
              allowEscapeKey: false,
            }).then(function (result) {
              if (data.redirect && data.redirect != "undefined") {
                location.replace(data.redirect);
              } else if (
                data.triggerclick &&
                data.triggerclick != "undefined"
              ) {
                $(document)
                  .find("." + data.triggerclick)
                  .trigger("click");
              } else if (typeof data.hide_by_class != "undefined") {
                $(document)
                  .find("." + data.hide_by_class)
                  .hide();
              } else if (typeof data.remove_by_class != "undefined") {
                $(document)
                  .find("." + data.remove_by_class)
                  .remove();
              } else if (typeof data.refresh != "undefined") {
                location.reload();
              } else if (typeof data.closswal != "undefined") {
                swal.close();
                if (
                  data.swaltriggerclick &&
                  data.swaltriggerclick != "undefined"
                ) {
                  $("." + data.swaltriggertrigger).trigger(
                    data.swaltriggerclick
                  );
                } else {
                  $("." + data.swaltriggertrigger).trigger("change");
                }
              } else if (
                data.modalclose != "undefined" &&
                data.trigger_class != "undefined" &&
                data.trigger_type != "undefined"
              ) {
                $("#" + data.modalclose).modal("hide");
                $("#" + data.modalclose).on("hidden.bs.modal", function () {});
                $("." + data.trigger_class).trigger(data.trigger_type);
              } else {
                location.reload();
              }
            });
          }

          if (
            data.txt_box_name != undefined &&
            data.txt_box_value != undefined
          ) {
            $(document)
              .find('input[name="' + data.txt_box_name + '"]')
              .val(data.txt_box_value);
          }

          if (data.html_div != undefined && data.html_data != undefined) {
            $(document)
              .find("." + data.html_div)
              .html(data.html_data);
          }

          if (
            data.append_html_div != undefined &&
            data.append_html_data != undefined
          ) {
            $(document)
              .find("." + data.append_html_div)
              .append(data.append_html_data);
          }

          if (data.ac_id != undefined && data.ac_id_value != undefined) {
            $(document)
              .find('input[name="' + data.ac_id + '"]')
              .val(data.ac_id_value);
          }

          if (data.ac_name != undefined && data.ac_name_value != undefined) {
            $(document)
              .find('input[name="' + data.ac_name + '"]')
              .val(data.ac_name_value);
          }

          if (
            data.trigger_class != undefined &&
            data.trigger_type != undefined
          ) {
            $(document)
              .find("." + data.trigger_class)
              .trigger(data.trigger_type);
          }
        } else if (data.status == 2) {
          if (data.type == "swal") {
            sweetAlert("Oops...", data.msg, "error");
          } else if (data.type == "toast") {
            Toast.fire({ icon: "error", title: data.msg });
          }

          if (data.redirect && data.redirect != "undefined") {
            setTimeout(function () {
              location.replace(data.redirect);
            }, 5000);
          } else if (data.triggerclick && data.triggerclick != "undefined") {
            setTimeout(function () {
              $(document)
                .find("." + data.triggerclick)
                .trigger("click");
            }, 5000);
          } else if (typeof data.refresh != "undefined") {
            setTimeout(function () {
              location.reload();
            }, 5000);
          }
        } else if (data.status == 3) {
          if (
            data.load_script_function &&
            data.load_script_function != "undefined"
          ) {
            window[data.load_script_function](data.has_tax);
          }
        }
      },
      error: function (data) {
        jQuery.each(data.responseJSON.errors, function (key, index) {
          if (~key.indexOf(".")) {
            key = key.replace(/\./gi, "-");
            $("#" + key)
              .closest(".form-group")
              .addClass("has-error")
              .append('<span class="help-block">' + index[0] + "</span>");
          } else {
            var input = $(form).find('[name="' + key + '"]');
            input
              .closest(".form-group")
              .addClass("has-error")
              .append('<span class="help-block">' + index[0] + "</span>");
          }
        });
      },
      complete: function () {
        $(submit_btn).html(btn_name);
        $(submit_btn).attr("disabled", false);
      },
    });
  });

  $(document).on("click", ".modal-submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var submit_btn = $(this);
    var btn_name = $(this).html();
    var new_btn_name = "Loading...";
    var form = $(this).parents("form:first");
    var method = $(form).attr("method");
    var url = $(form).attr("action");
    var modal = $(this).closest(".modal").attr("id");

    $(form).ajaxSubmit({
      type: method,
      url: url,
      dataType: "JSON",
      beforeSend: function () {
        $(submit_btn).html(new_btn_name);
        $(submit_btn).attr("disabled", true);
        $(form).find(".form-group").removeClass("has-error");
        $(form).find(".help-block").remove();
      },
      success: function (data) {
        if (data.redirect_url) {
          window.open(data.redirect_url, "_blank");
        }
        if (data.reload_url) {
          window.location.reload();
        }

        if (data.status == 1) {
          $(submit_btn).attr("disabled", true);
          $("#" + modal).modal("hide");
          $("#" + modal).on("hidden.bs.modal", function () {
            $(".modal-content").html(" ");
          });

          if (data.type == "toast") {
            Toast.fire({ icon: "success", title: data.msg });

            if (data.redirect && data.redirect != "undefined") {
              setTimeout(function () {
                location.replace(data.redirect);
              }, 2000);
            } else if (data.triggerclick && data.triggerclick != "undefined") {
              setTimeout(function () {
                $(document)
                  .find("." + data.triggerclick)
                  .trigger("click");
              }, 2000);
            } else if (typeof data.refresh != "undefined") {
              setTimeout(function () {
                location.reload();
              }, 2000);
            }
          } else {
            swal({
              title: "Done",
              text: data.msg,
              type: "success",
              closeOnConfirm: true,
              allowEscapeKey: false,
            }).then(function (result) {
              if (data.trigger_click && data.trigger_click != "undefined") {
                $(document)
                  .find("." + data.trigger_click)
                  .trigger("click");
              }

              if (data.append_html != "" && data.append_html != "undefined") {
                $("." + data.html).append(data.append_html);
              }

              if (data.html != "undefined" && data.trigger != "undefined") {
                $("." + data.html).trigger(data.trigger);
              }

              if (data.refresh && data.refresh != "undefined") {
                setTimeout(function () {
                  location.reload();
                }, 2000);
              }
            });
          }
        } else if (data.status == 2) {
          if (data.type == "swal") {
            sweetAlert("Oops...", data.msg, "error");
          } else if (data.type == "toast") {
            Toast.fire({ icon: "error", title: data.msg });
          }
        } else if (data.status == 3) {
          $(submit_btn).attr("disabled", true);
          //$('#'+modal).modal('hide');
          if (data.triggerclick && data.triggerclick != "undefined") {
            //setTimeout(function () {
            $(document)
              .find("." + data.triggerclick)
              .trigger("click");
            //}, 2000);
          } else if (typeof data.refresh != "undefined") {
            setTimeout(function () {
              location.reload();
            }, 2000);
          }
        }
      },
      error: function (data) {
        console.log(data);
        jQuery.each(data.responseJSON, function (key, error) {
          if (~key.indexOf(".")) {
            key = key.replace(/\./gi, "-");
            $("#" + key)
              .closest(".form-group")
              .addClass("has-error")
              .append('<span class="help-block text-danger">' + error + "</span>");
          } else {
            var input = $(form).find('[name="' + key + '"]');
            input
              .closest(".form-group")
              .addClass("has-error")
              .append('<span class="help-block text-danger">' + error + "</span>");
          }
        });
      },
      complete: function () {
        $(submit_btn).html(btn_name);
        $(submit_btn).attr("disabled", false);
      },
    });
  });

  $(document).on("change", ".select-change", function (e) {
    e.preventDefault();
    e.stopPropagation();

    var val = $(this).val();
    var target = $(this).attr("data-target");
    var string = $(this).attr("data-string");
    var url = $(this).attr("data-url");
    var type = $(this).attr("data-type");
    var other = $(this).attr("data-other-target");
    var trigger = $(this).attr("select-trigger");

    /*$('.state-url').css('display','none');*/
    // $('.city-url').css('display','none');

    if (val == "Others_state") {
      $("#add_city_show").removeClass("d-none");
      $("#add_state_show").removeClass("d-none");
      $(".old_city").addClass("d-none");
    } else if (val == "Others_city") {
      $("#add_city_show").removeClass("d-none");
    } else {
      $("#add_city_show").addClass("d-none");
      $("#add_state_show").addClass("d-none");
      $(".old_city").removeClass("d-none");
    }

    jQuery.ajax({
      type: type,
      url: url + "?" + string + "=" + val,
      dataType: "JSON",
      beforeSend: function () {
        $("#" + target).html('<option value="">Loading..</option>');

        if (other != "" && other != "undefined") {
          $("." + other).html('<option value="">Choose..</option>');
        }
      },
      success: function (data) {
        //console.log(data.addClass);
        if (data.addClass == "") {
          $("#" + target).html(data.html);
        } else {
          $("#" + target).addClass(data.addClass);
        }

        if (data.parent_id != "" && data.parent_id != undefined) {
          $("." + data.child_class).show();

          $("." + data.sub_child_class).show();

          if (data.child_class != "" && data.child_url != "") {
            $("." + data.child_class).attr("href", data.child_url);
          }
        } else {
          $("." + data.child_class).css("display", "none");
          $("." + data.sub_child_class).css("display", "none");
        }

        $("#" + target).html(data.options);

        if (trigger != "" && trigger != "undefined") {
          $("." + trigger).trigger("change");
        }
      },
    });
  });

  $(document).on("click", ".report-submit", function (e) {
    e.preventDefault();
    e.stopPropagation();
    var submit_btn = $(this);
    var btn_name = $(this).html();
    var new_btn_name = "Loading...";
    var form = $(this).parents("form:first");
    var method = $(form).attr("method");
    var url = $(form).attr("action");

    var is_paginate = 0;

    if (
      $(this).attr("data-pagination") != "undefined" &&
      $(this).attr("data-pagination") == true
    ) {
      is_paginate = 1;
    }

    $(form).ajaxSubmit({
      type: method,
      url: url,
      dataType: "JSON",
      beforeSend: function () {
        $(submit_btn).html(new_btn_name);
        $(submit_btn).attr("disabled", true);
        $(form).find(".form-group").removeClass("has-error");
        $(form).find(".help-block").remove();

        if (
          $.fn.DataTable &&
          $.fn.DataTable.isDataTable("#report-table-details")
        ) {
          $("#report-table-details").DataTable().destroy();
        }
      },
      success: function (data) {
        if ($("#report-table-details").length > 0) {
          if (data["records"] != "") {
            $(document).find(".total-records span").html(data["records"]);
          } else {
            $(document).find(".total-records span").html(0);
          }

          if (data["records"] > 0) {
            $(".print").show();
            $("#export").show();
          } else {
            $(".print").hide();
            $("#export").hide();
          }

          if (data["table"] != "") {
            if (data["thead"] != undefined && data["thead"] == "true") {
              $("#report-table-details").html(data["table"]);
            } else {
              $("#report-table-details").find("tbody").html(data["table"]);
            }
          } else {
            $td_count = $("#report-table-details").find("thead tr th").length;
            $("#report-table-details")
              .find("tbody")
              .html(
                '<tr><td colspan="' +
                  $td_count +
                  '" class="text-center"> No Records </td></tr>'
              );
          }

          if (typeof data["tfoot"] != "undefined" && data["tfoot"] != "") {
            $("#report-table-details").find("tfoot").html(data["tfoot"]);
          }

          if (typeof data["tfoot"] != "undefined" && data["tfoot"] != "") {
            $("#report-table-details").find("tfoot").html(data["tfoot"]);
          }

          if (
            typeof data["pagination"] != "undefined" &&
            data["pagination"] != ""
          ) {
            $(".table-pagination-div").html(data["pagination"]);
          } else {
            $(".table-pagination-div").html("");
          }

          if (
            typeof data["export"] != "undefined" &&
            data["export"] == true &&
            data["table"] != ""
          ) {
            var filename = url.substring(url.lastIndexOf("/") + 1);

            $("#report-table-details").DataTable({
              dom: "Brti",
              paging: false,
              bInfo: false,
              retrieve: true,
              buttons: {
                buttons: [
                  {
                    extend: "csv",
                    className: "btn btn-sm btn-primary mb-1",
                    text: '<i class="fa fa-file-excel-o mr-1"></i> Export CSV',
                    title: filename,
                  },
                ],
              },
            });
          }
        }
      },
      error: function (data) {
        jQuery.each(data.responseJSON, function (key, index) {
          if (~key.indexOf(".")) {
            key = key.replace(/\./gi, "-");
            $("#" + key)
              .closest(".form-group")
              .addClass("has-error")
              .append('<span class="help-block">' + index[0] + "</span>");
          } else {
            var input = $(form).find('[name="' + key + '"]');
            input
              .closest(".form-group")
              .addClass("has-error")
              .append('<span class="help-block">' + index[0] + "</span>");
          }
        });
      },
      complete: function () {
        $(submit_btn).html(btn_name);
        $(submit_btn).attr("disabled", false);
      },
    });
  });

  //universal delete function
  $(document).on("click", ".btn-delete", function (e) {
    e.preventDefault();
    var url = $(this).attr("href");
    var $title = "Delete Data";
    var $msg = "Are You Sure You Want To Delete Data";
    var $method = "DELETE";
    swal({
      title: $title,
      text: $msg,
      type: "warning",
      showCancelButton: true,
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
    }).then(function (result) {
      if (result.value) {
        jQuery.ajax({
          type: $method,
          data: { _method: $method },
          dataType: "JSON",
          url: url,
          success: function (data) {
            if (data.response == 1) {
              swal({
                title: "Done",
                text: data.msg,
                type: "success",
                closeOnConfirm: true,
                allowEscapeKey: false,
              }).then(function (result) {
                if (data.trigger_click && data.trigger_click != "undefined") {
                  $(document)
                    .find("." + data.trigger_click)
                    .trigger("click");
                }

                if (typeof data.remove_by_class != "undefined") {
                  $(document)
                    .find("." + data.remove_by_class)
                    .remove();
                }
              });
            } else if (data.response == 2) {
              swal("Oops...", data.msg, "error");
            } else if (data.response == 3) {
              swal(data.msg);
              if (data.triggerclick && data.triggerclick != "undefined") {
                $(document)
                  .find("." + data.triggerclick)
                  .trigger("click");
              }
            }
          },
        });
      }
    });
  });

  $(".select2").select2({
    templateResult: template,
    templateSelection: template_selected,
    escapeMarkup: function (m) {
      return m;
    },
  });
});

function template_selected(data) {
  var $tmp_option = data.text.split("__");
  return $tmp_option[0];
}

function template(data) {
  var $tmp_option = data.text.split("__");
  var $option = '<span class="comboboxItemName">' + $tmp_option[0] + "</span>";

  if ($tmp_option[1] != undefined && $tmp_option[1] != "") {
    $option += '<span class="comboboxSubType">' + $tmp_option[1] + "</span>";
  }

  return $option;
}

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

function showNotification(text, theme, life, pos_hor, pos_ver) {
  life = typeof life !== "undefined" ? life : 7500;
  theme = typeof theme !== "undefined" ? theme : "success";
  pos_hor = typeof pos_hor !== "undefined" ? pos_hor : "bottom";
  pos_ver = typeof pos_ver !== "undefined" ? pos_ver : "right";

  n_text_olor = "#fff";
  n_background_olor = "#3b3f5c";

  if (theme == "success") {
    n_background_olor = "#1abc9c";
  } else if (theme == "error") {
    n_background_olor = "#e7515a";
  } else if (theme == "warning") {
    n_background_olor = "#e2a03f";
  } else if (theme == "info") {
    n_background_olor = "#2196f3";
  }

  Snackbar.show({
    text: text,
    duration: life,
    pos: pos_hor + "-" + pos_ver,
    actionTextColor: n_text_olor,
    backgroundColor: n_background_olor,
    actionText: "X",
  });
}

$(document).on("click", ".tab-ajax", function () {
  var url = $(this).attr("href");
  jQuery.ajax({
    type: "GET",
    url: url,
    dataType: "HTML",
    beforeSend: function () {
      $(".tab-pane").html(
        '<div><h3 class="text-center" style="margin: 50px 0;"><i class="fa fa-spin fa-refresh"></i>&nbsp;Wait for data ....</h3></div>'
      );
    },
    success: function (data) {
      $(".tab-pane").html(data);
    },
  });
});
