from flask import Flask, render_template, render_template_string, redirect, jsonify
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
import pandas as pd
import numpy as np
import time

# create instance of Flask app
app = Flask(__name__)

#Creating Engine / Session
engine = create_engine("sqlite:///DataSets/belly_button_biodiversity.sqlite", echo=False)
session = Session(engine)

#Reflecting the database
Base = automap_base()
Base.prepare(engine, reflect = True)

#creating the otu dataframe
otu_df = pd.read_sql_table("otu", engine, index_col = "otu_id")

#creating the samples dataframe
samples_df = pd.read_sql_table("samples", engine, index_col = "otu_id")

#creating the samples_metadata dataframe
path = r'C:\Users\sethd\OneDrive\Documents\GWU Data Analytics\Advanced_Visualization\javascript_api_homework\DataSets\Belly_Button_Biodiversity_Metadata.csv'
samples_metadata_df = pd.read_csv(path, index_col = "SAMPLEID")

@app.route("/")
def index():
    
    # return elements to integrate into the plotly charts

    return render_template("index.html")


@app.route('/names')
def names():
    """List of sample names."""
    
    #create a list of sample names
    names = [name for name in samples_df.columns]
      
    return jsonify(names)


@app.route('/otu')
def otu():
    """List of OTU descriptions."""

    otu = list(otu_df['lowest_taxonomic_unit_found'])

    return jsonify(otu)



@app.route('/metadata/<sample>')
def metadata(sample):
    """Return MetaData for a given sample."""

    samp_num = int(sample[3:])
    result = samples_metadata_df.loc[samp_num]
    cols = ['AGE', 'BBTYPE', 'ETHNICITY', 'GENDER', 'LOCATION']
    sum_result = result[cols]
    sum_result['SAMPLEID'] = sample
    sum_result = sum_result.to_dict()
    
    return jsonify(sum_result)


@app.route('/wfreq/<sample>')
def wfreq(sample):
    """Weekly Washing Frequency as a number."""

    samp_num = int(sample[3:])
    result = samples_metadata_df.loc[samp_num]
    sum_result = result['WFREQ']

    return jsonify(sum_result)


@app.route('/samples/<sample>')
def samples(sample):
    """OTU IDs and Sample Values for a given sample."""

    obs = samples_df[sample]
    non_null_obs = obs[obs > 0]
    sorted_obs = non_null_obs.sort_values(ascending = False)
    otu_ids, sample_values = zip(*sorted_obs.items())
    otu_ids = [int(otu) for otu in otu_ids]
    sample_values = [int(sample) for sample in sample_values]
    sample_dict = {"otu_ids": otu_ids, "sample_values": sample_values}
    return jsonify(sample_dict)

if __name__ == "__main__":
    app.run(debug=True)
