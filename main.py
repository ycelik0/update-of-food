from flask import Flask, redirect, jsonify, request
import pandas as pd
import flask
import http
import mysql.connector

app = Flask(__name__)

file_path = "linked_results.csv"

db_params = {
    "host": "185.104.29.122",
    "database": "ortho_food",
    "user": "ortho_food",
    "password": "Tdhg8Khz",
}


def make_success_response(status: int, **kwargs):
    payload = {"status": "success"}
    payload["data"] = kwargs
    return flask.make_response(flask.jsonify(payload), status)


def custom_csv_parser(file_path):
    data = []  # To store row data
    with open(file_path, "r", encoding="utf-8") as file:
        # Assuming the first line contains headers and the headers for search results are not fixed
        headers = file.readline().strip().split(";")  # Read the first line for headers
        for line in file.readlines():  # Continue with the rest of the lines
            parts = line.strip().split(";")
            food_id = parts[0]
            food_name = parts[1]
            search_results = parts[3:]  # All remaining parts are search results
            data.append(
                {
                    "Food ID": food_id,
                    "Food Name": food_name,
                    "Search Results": search_results,
                }
            )

    return pd.DataFrame(data)


@app.route("/")
def hello_world():
    return redirect("/1", code=302)


@app.post("/post/<id>")
def update_row(id: int):
    print(id, request.get_json())
    selected_value = request.get_json().get("selectedValue")
    
    conn = mysql.connector.connect(**db_params)
    cursor = conn.cursor()
    
    if selected_value is not None:
        query = "UPDATE food SET passio_id = %s WHERE id = %s"
        cursor.execute(query, (selected_value.split(':')[0], id))
    else:
        query = "UPDATE food SET passio_id = NULL WHERE id = %s"
        cursor.execute(query, (id,))
    
    # Commit the changes and close the connection
    conn.commit()
    conn.close()
    return make_success_response(http.HTTPStatus.OK)


@app.route("/<id>")
def row(id: int):
    df = custom_csv_parser(file_path)

    # Filter the DataFrame to get the row with the matching Food ID
    matching_rows = df[
        df["Food ID"] == str(id)
    ]  # Convert id to string if your IDs are strings in the DataFrame

    # Assuming you want all matching entries for a given ID
    food = {
        "id": int(id),
        "name": matching_rows.iloc[0]["Food Name"],
        "results": [
            result
            for sublist in matching_rows["Search Results"].tolist()
            for result in sublist
        ],  # Flatten the list of lists
    }

    css = "@import url(https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap);.result,h1{text-align:center}body{font-family:Poppins,sans-serif;background:#b9b3a9;display:flex;justify-content:center}.container{width:450px;padding:20px;margin-top:80px;background-color:#fff;box-shadow:0 2px 4px rgba(0,0,0,.1);border-radius:20px}.question{font-weight:700;margin-bottom:10px}.options{margin-bottom:20px}.option{display:block;margin-bottom:10px}.button{display:inline-block;padding:10px 20px;background-color:#428bca;color:#fff;border:none;cursor:pointer;font-size:16px;border-radius:4px;transition:background-color .3s;margin-right:10px}.button:hover{background-color:#3071a9}.result{margin-top:20px;font-weight:700}.hide{display:none}"
    results_json = jsonify(food["results"]).get_data(as_text=True)

    previous_food_id = food["id"] - 1
    next_food_id = food["id"] + 1
    javascript = f"""
    window.onload = function() {{
      var results = {results_json};
      var resultDiv = document.getElementById('result');
      var nameForRadioButtons = "flexRadioDefault"; // All radio buttons will share this name

      results.forEach(function(item, index) {{
        var formCheckDiv = document.createElement("DIV");
        formCheckDiv.className = "form-check";

        var radioButton = document.createElement("INPUT");
        radioButton.className = "form-check-input";
        radioButton.type = "radio";
        radioButton.name = nameForRadioButtons;
        radioButton.id = nameForRadioButtons + index;
        radioButton.value = item; // Set the value of the radio button to the item

        var label = document.createElement("LABEL");
        label.className = "form-check-label";
        label.setAttribute("for", nameForRadioButtons + index);
        label.textContent = item.substring(item.indexOf(':') + 1);

        formCheckDiv.appendChild(radioButton);
        formCheckDiv.appendChild(label);
        resultDiv.appendChild(formCheckDiv);
      }});

      document.getElementById('previous').addEventListener('click', function() {{
        window.location.assign('http://127.0.0.1:5000/' + {previous_food_id});
      }})
      document.getElementById('next').addEventListener('click', function() {{
        var selectedValue;
        var radios = document.getElementsByName(nameForRadioButtons);
        for (var i = 0; i < radios.length; i++) {{
          if (radios[i].checked) {{
            selectedValue = radios[i].value; // Get the value of the selected radio button
            break;
          }}
        }}
        fetch("http://127.0.0.1:5000/post/{food["id"]}", {{
          method: "POST",
          headers: {{
            "Content-Type": "application/json",
          }},
          body: JSON.stringify({{selectedValue: selectedValue}}), // Send the selected value in the POST request
        }}).then(response => {{
          if (response.ok) {{
            window.location.assign('http://127.0.0.1:5000/' + {next_food_id});
          }} else {{
            console.error('Failed to update');
          }}
        }});
      }});
    }}
    """

    return f"""
  <!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css">
  <link rel="icon" type="image/x-icon" href="https://img.icons8.com/?size=50&id=jHTpT63mCPmd&format=png">
  <title>Passio Foods</title>
</head>
<body>
  <style>{css}</style>
  <div class="container">
    <h1>{food['id']}. {food['name']}</h1>
    <button id="previous" class="button">Previous</button>
    <button id="next" class="button">Next</button>
    <div id="result" class="result"></div>
  </div>
  <script type="text/javascript">{javascript}</script>
</body>
</html>
  """
