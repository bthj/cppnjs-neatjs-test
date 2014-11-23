var neatjs = require('neatjs');



///////////////////////////////////////////////////
// seed creation

var weightRange = 2;
var connectionProportion = 1;
var ins = 2;
//var ins = 1;
//var outs = 1;
var outs = 2;

var seedCount = 5;
var initialPopulationSeeds = [];
// create initial seed genomes for coming population(s members)
for( var i=0; i < seedCount; i++ ) {

  //clear out genome IDs and innovation IDs
  // -> not sure why / if this is needed?
  neatjs.neatGenome.Help.resetGenomeID();
  // NeatGenome.Help.resetInnovationID();

  var neatGenome = neatjs.neatGenome.Help.CreateGenomeByInnovation(
            ins,
            outs,
            {
              connectionProportion: connectionProportion,
              connectionWeightRange: weightRange
            }
  );
  initialPopulationSeeds.push( neatGenome );
}

console.log( initialPopulationSeeds );


///////////////////////////////////////////////////
// Interactive Evolution Computation (IEC) setup

var np = new neatjs.neatParameters();
// defaults taken from
// https://github.com/OptimusLime/win-gen/blob/d11e6df5e7b8948f292c999ad5e6c24ab0198e23/old/plugins/NEAT/neatPlugin.js#L63
// https://github.com/OptimusLime/win-neat/blob/209f00f726457bcb7cd63ccc1ec3b33dec8bbb66/lib/win-neat.js#L20
np.pMutateAddConnection = .13;
np.pMutateAddNode = .13;
np.pMutateDeleteSimpleNeuron = .00;
np.pMutateDeleteConnection = .00;
np.pMutateConnectionWeights = .72;
np.pMutateChangeActivations = .02;

np.pNodeMutateActivationRate = 0.2;
np.connectionWeightRange = 3.0;
np.disallowRecurrence = true;


// IEC options taken from
// https://github.com/OptimusLime/win-Picbreeder/blob/33366ef1d8bfd13c936313d2fdb2afed66c31309/html/pbHome.html#L95
// https://github.com/OptimusLime/win-Picbreeder/blob/33366ef1d8bfd13c936313d2fdb2afed66c31309/html/pbIEC.html#L87
var iecOptions = {
  initialMutationCount : 5,
  postMutationCount : 5  // AKA mutationsOnCreation
};
var iecGenerator = new neatjs.iec( np, initialPopulationSeeds, iecOptions );

//var iecGenerator = neatjs.iec.GenericIEC;
// iecGenerator( np, seeds, {postMutationCount: mutationsOnCreation} );
//var co = iecGenerator.createNextGenome.call(iecGenerator, genomeParents);

///////////////////////////////////////////////////
// Create first population from seeds
var currentPopulationIndex = 0;

var populations = {};
var populationSize = 10;

var firstPopulation = [];
for( var i=0; i < populationSize; i++ ) {

  // individuals in the first population have no actual parents;
  // instead they are mutations of some random seed genome:
  var onePopulationMember = iecGenerator.createNextGenome( [] );
  firstPopulation.push( onePopulationMember );
}

populations[currentPopulationIndex] = firstPopulation;


displayCurrentGeneration();
renderPopulation( currentPopulationIndex );



// console.log( np );
// console.log( populations );

function renderPopulation( populationIndex ) {
  var numberOfSeries = 4096; // maximum umber allowed according to the Web Audio API

  var populationToRender = populations[populationIndex];

  // $('#population-container').empty();

  for( var i=0; i < populationToRender.length; i++ ) {
    var oneMember = populationToRender[i];
    var oneMemberCPPN = oneMember.offspring.networkDecode();

    var oneMemberOutputs = [];
    for( var j=0; j < numberOfSeries; j++ ) {

      var rangeFraction = j / (numberOfSeries-1);
      var yInputSignal = lerp( -1, 1, rangeFraction );

      var extraInput = Math.sin(Math.abs(10*yInputSignal));

      // var inputSignals = [1, Math.abs(yInputSignal), yInputSignal]; // d(istance), input
      var inputSignals = [Math.abs(yInputSignal), extraInput]; // d(istance), input
      //var inputSignals = [Math.abs(yInputSignal)]; // d(istance), input

      oneMemberCPPN.clearSignals();
      oneMemberCPPN.setInputSignals( inputSignals );

      oneMemberCPPN.recursiveActivation();

      oneMemberOutputs.push(
        [j, oneMemberCPPN.getOutputSignal(0), oneMemberCPPN.getOutputSignal(1)] );
    }

    // var oneMemberDiv = $('<div/>', {'id': 'member-container-'+i});
    // var oneMemberGraphContainer = $('<div/>', {'id': 'graph-'+i});
    // oneMemberDiv.append( oneMemberGraphContainer );
    // $('#population-container').append( oneMemberDiv );
    // ...bah, I put all the html by hand into index.html, as Dygraph doesn't
    // pick up dynamically created elements...

    new Dygraph(
      document.getElementById("graph-"+i),
      oneMemberOutputs,
      {
        labels: ["time (frequency?) domain", "modulation", "carrier" ],
        valueRange: [-1, 1]
      }
    );
  }
}


function evolveNextGeneration() {

  // let's get all selected individuals in the UI, to use as parents
  var parentIndexes = [];
  $( "input[name^='member-']:checked" ).each(function(){
    parentIndexes.push( parseInt( $(this).attr("name").substring(7) ) );
  });

  if( parentIndexes.length < 1 ) {
    alert("At least one parent needs to be selected for the next generation.");
    return;
  }

  var currentPopulation = populations[currentPopulationIndex];
  var parents = [];
  $.each( parentIndexes, function( oneParentIndex, value ) {

    parents.push( currentPopulation[oneParentIndex].offspring );
  });

  console.log( parents );

  // let's create a new population from the chosen parents
  var newPopulation = [];
  for( var i=0; i < populationSize; i++ ) {

    var onePopulationMember = iecGenerator.createNextGenome( parents );
    newPopulation.push( onePopulationMember );
  }
  currentPopulationIndex++;
  populations[currentPopulationIndex] = newPopulation;

  displayCurrentGeneration();
  renderPopulation( currentPopulationIndex );

  $( "input[name^='member-']" ).each( function(){
    $(this).attr( 'checked', false );
  });
}

$(function() {
  $(".evolve").click( function() {

    evolveNextGeneration();
  });
});


/*
var oneCPPN = firstPopulation[0].offspring.networkDecode();
var numberOfSeries = 4096;  // maximum umber allowed according to the Web Audio API

var testOutputs = [];
for( var i=0; i < numberOfSeries; i++ ) {

  var rangeFraction = i / (numberOfSeries-1);
  var yInputSignal = lerp( -1, 1, rangeFraction );

  var inputSignals = [1, Math.abs(yInputSignal), yInputSignal]; // d(istance), input
  //var inputSignals = [Math.sin(10*yInputSignal)]; // input

  oneCPPN.clearSignals();
  oneCPPN.setInputSignals( inputSignals );

  //oneCPPN.multipleSteps(30);
  oneCPPN.recursiveActivation();

  testOutputs.push( [i, oneCPPN.getOutputSignal(0), oneCPPN.getOutputSignal(1)] );
}

// console.log( oneCPPN );
// console.log( testOutputs );

new Dygraph( document.getElementById("graph"),
  testOutputs,
  {
    labels: ["time (frequency?) domain", "modulation", "carrier" ],
    valueRange: [-1, 1]
  }
);
*/


function lerp( from, to, fraction ) {
  return from + fraction * ( to - from );
}

function displayCurrentGeneration() {
  $('h2').text( "Generation " + currentPopulationIndex );
}
