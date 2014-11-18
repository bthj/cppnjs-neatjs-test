/**
 * Require the module at `name`.
 *
 * @param {String} name
 * @return {Object} exports
 * @api public
 */

function require(name) {
  var module = require.modules[name];
  if (!module) throw new Error('failed to require "' + name + '"');

  if (!('exports' in module) && typeof module.definition === 'function') {
    module.client = module.component = true;
    module.definition.call(this, module.exports = {}, module);
    delete module.definition;
  }

  return module.exports;
}

/**
 * Meta info, accessible in the global scope unless you use AMD option.
 */

require.loader = 'component';

/**
 * Internal helper object, contains a sorting function for semantiv versioning
 */
require.helper = {};
require.helper.semVerSort = function(a, b) {
  var aArray = a.version.split('.');
  var bArray = b.version.split('.');
  for (var i=0; i<aArray.length; ++i) {
    var aInt = parseInt(aArray[i], 10);
    var bInt = parseInt(bArray[i], 10);
    if (aInt === bInt) {
      var aLex = aArray[i].substr((""+aInt).length);
      var bLex = bArray[i].substr((""+bInt).length);
      if (aLex === '' && bLex !== '') return 1;
      if (aLex !== '' && bLex === '') return -1;
      if (aLex !== '' && bLex !== '') return aLex > bLex ? 1 : -1;
      continue;
    } else if (aInt > bInt) {
      return 1;
    } else {
      return -1;
    }
  }
  return 0;
}

/**
 * Find and require a module which name starts with the provided name.
 * If multiple modules exists, the highest semver is used. 
 * This function can only be used for remote dependencies.

 * @param {String} name - module name: `user~repo`
 * @param {Boolean} returnPath - returns the canonical require path if true, 
 *                               otherwise it returns the epxorted module
 */
require.latest = function (name, returnPath) {
  function showError(name) {
    throw new Error('failed to find latest module of "' + name + '"');
  }
  // only remotes with semvers, ignore local files conataining a '/'
  var versionRegexp = /(.*)~(.*)@v?(\d+\.\d+\.\d+[^\/]*)$/;
  var remoteRegexp = /(.*)~(.*)/;
  if (!remoteRegexp.test(name)) showError(name);
  var moduleNames = Object.keys(require.modules);
  var semVerCandidates = [];
  var otherCandidates = []; // for instance: name of the git branch
  for (var i=0; i<moduleNames.length; i++) {
    var moduleName = moduleNames[i];
    if (new RegExp(name + '@').test(moduleName)) {
        var version = moduleName.substr(name.length+1);
        var semVerMatch = versionRegexp.exec(moduleName);
        if (semVerMatch != null) {
          semVerCandidates.push({version: version, name: moduleName});
        } else {
          otherCandidates.push({version: version, name: moduleName});
        } 
    }
  }
  if (semVerCandidates.concat(otherCandidates).length === 0) {
    showError(name);
  }
  if (semVerCandidates.length > 0) {
    var module = semVerCandidates.sort(require.helper.semVerSort).pop().name;
    if (returnPath === true) {
      return module;
    }
    return require(module);
  }
  // if the build contains more than one branch of the same module
  // you should not use this funciton
  var module = otherCandidates.pop().name;
  if (returnPath === true) {
    return module;
  }
  return require(module);
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Register module at `name` with callback `definition`.
 *
 * @param {String} name
 * @param {Function} definition
 * @api private
 */

require.register = function (name, definition) {
  require.modules[name] = {
    definition: definition
  };
};

/**
 * Define a module's exports immediately with `exports`.
 *
 * @param {String} name
 * @param {Generic} exports
 * @api private
 */

require.define = function (name, exports) {
  require.modules[name] = {
    exports: exports
  };
};
require.register("optimuslime~cppnjs@master", function (exports, module) {
var cppnjs = {};

//export the cppn library
module.exports = cppnjs;

//CPPNs
cppnjs.cppn = require('optimuslime~cppnjs@master/networks/cppn.js');

cppnjs.addAdaptable = function()
{
    require('optimuslime~cppnjs@master/extras/adaptableAdditions.js');
};

cppnjs.addPureCPPN = function()
{
    require('optimuslime~cppnjs@master/extras/pureCPPNAdditions.js');
};

cppnjs.addGPUExtras = function()
{
    //requires pureCPPN activations
    cppnjs.addPureCPPN();
    require('optimuslime~cppnjs@master/extras/gpuAdditions.js');
};

//add GPU extras by default
cppnjs.addGPUExtras();





//nodes and connections!
cppnjs.cppnNode = require('optimuslime~cppnjs@master/networks/cppnNode.js');
cppnjs.cppnConnection = require('optimuslime~cppnjs@master/networks/cppnConnection.js');

//all the activations your heart could ever hope for
cppnjs.cppnActivationFunctions = require('optimuslime~cppnjs@master/activationFunctions/cppnActivationFunctions.js');
cppnjs.cppnActivationFactory = require('optimuslime~cppnjs@master/activationFunctions/cppnActivationFactory.js');

//and the utilities to round it out!
cppnjs.utilities = require('optimuslime~cppnjs@master/utility/utilities.js');

//exporting the node type
cppnjs.NodeType = require('optimuslime~cppnjs@master/types/nodeType.js');



});

require.register("optimuslime~cppnjs@master/activationFunctions/cppnActivationFactory.js", function (exports, module) {
var utils = require('optimuslime~cppnjs@master/utility/utilities.js');
var cppnActivationFunctions = require('optimuslime~cppnjs@master/activationFunctions/cppnActivationFunctions.js');

var Factory = {};

module.exports = Factory;

Factory.probabilities = [];
Factory.functions = [];
Factory.functionTable= {};

Factory.createActivationFunction = function(functionID)
{
    if(!cppnActivationFunctions[functionID])
        throw new Error("Activation Function doesn't exist!");
    // For now the function ID is the name of a class that implements IActivationFunction.
    return new cppnActivationFunctions[functionID]();

};

Factory.getActivationFunction = function(functionID)
{
    var activationFunction = Factory.functionTable[functionID];
    if(!activationFunction)
    {
//            console.log('Creating: ' + functionID);
//            console.log('ActivationFunctions: ');
//            console.log(cppnActivationFunctions);

        activationFunction = Factory.createActivationFunction(functionID);
        Factory.functionTable[functionID] = activationFunction;
    }
    return activationFunction;

};

Factory.setProbabilities = function(oProbs)
{
    Factory.probabilities = [];//new double[probs.Count];
    Factory.functions = [];//new IActivationFunction[probs.Count];
    var counter = 0;

    for(var key in oProbs)
    {
        Factory.probabilities.push(oProbs[key]);
        Factory.functions.push(Factory.getActivationFunction(key));
        counter++;
    }

};

Factory.defaultProbabilities = function()
{
    var oProbs = {'BipolarSigmoid' :.25, 'Sine':.25, 'Gaussian':.25, 'Linear':.25};
    Factory.setProbabilities(oProbs);
};
Factory.getRandomActivationFunction = function()
{
    if(Factory.probabilities.length == 0)
        Factory.defaultProbabilities();

    return Factory.functions[utils.RouletteWheel.singleThrowArray(Factory.probabilities)];
};


});

require.register("optimuslime~cppnjs@master/activationFunctions/cppnActivationFunctions.js", function (exports, module) {
var cppnActivationFunctions = {};

module.exports = cppnActivationFunctions;

//implemented the following:
//BipolarSigmoid
//PlainSigmoid
//Gaussian
//Linear
//NullFn
//Sine
//StepFunction

cppnActivationFunctions.ActivationFunction = function(functionObj)
{
    var self = this;
    self.functionID = functionObj.functionID;
    self.functionString = functionObj.functionString;
    self.functionDescription = functionObj.functionDescription;
    self.calculate = functionObj.functionCalculate;
    self.enclose = functionObj.functionEnclose;
//        console.log('self.calc');
//        console.log(self.calculate);
//        console.log(self.calculate(0));
};

//this makes it easy to overwrite an activation function from the outside
//cppnActivationFunctions.AddActivationFunction("BiplorSigmoid", {NEW IMPLEMENTATION});
//this can be useful for customizing certain functions for your domain while maintaining the same names

cppnActivationFunctions.AddActivationFunction = function(functionName, description)
{
    cppnActivationFunctions[functionName] = function()
    {
        return new cppnActivationFunctions.ActivationFunction(description);
    }
};

cppnActivationFunctions.AddActivationFunction(
    "BipolarSigmoid",
    {
        functionID: 'BipolarSigmoid' ,
        functionString: "2.0/(1.0 + exp(-4.9*inputSignal)) - 1.0",
        functionDescription: "bipolar steepend sigmoid",
        functionCalculate: function(inputSignal)
        {
            return (2.0 / (1.0 + Math.exp(-4.9 * inputSignal))) - 1.0;
        },
        functionEnclose: function(stringToEnclose)
        {
            return "((2.0 / (1.0 + Math.exp(-4.9 *(" + stringToEnclose + ")))) - 1.0)";
        }
    });

cppnActivationFunctions.AddActivationFunction(
    "PlainSigmoid",
    {
        functionID: 'PlainSigmoid' ,
        functionString: "1.0/(1.0+(exp(-inputSignal)))",
        functionDescription: "Plain sigmoid [xrange -5.0,5.0][yrange, 0.0,1.0]",
        functionCalculate: function(inputSignal)
        {
            return 1.0/(1.0+(Math.exp(-inputSignal)));
        },
        functionEnclose: function(stringToEnclose)
        {
            return "(1.0/(1.0+(Math.exp(-1.0*(" + stringToEnclose + ")))))";
        }
    });

cppnActivationFunctions.AddActivationFunction(
    "Gaussian",
    {
        functionID:  'Gaussian',
        functionString: "2*e^(-(input*2.5)^2) - 1",
        functionDescription:"bimodal gaussian",
        functionCalculate: function(inputSignal)
        {
            return 2 * Math.exp(-Math.pow(inputSignal * 2.5, 2)) - 1;
        },
        functionEnclose: function(stringToEnclose)
        {
            return "(2.0 * Math.exp(-Math.pow(" + stringToEnclose + "* 2.5, 2.0)) - 1.0)";
        }
    });

cppnActivationFunctions.AddActivationFunction(
    "Linear",
    {
        functionID:   'Linear',
        functionString: "Math.abs(x)",
        functionDescription:"Linear",
        functionCalculate: function(inputSignal)
        {
            return Math.abs(inputSignal);
        },
        functionEnclose: function(stringToEnclose)
        {
            return "(Math.abs(" + stringToEnclose + "))";
        }
    });

cppnActivationFunctions.AddActivationFunction(
    "NullFn",
    {
        functionID:   'NullFn',
        functionString: "0",
        functionDescription: "returns 0",
        functionCalculate: function(inputSignal)
        {
            return 0.0;
        },
        functionEnclose: function(stringToEnclose)
        {
            return "(0.0)";
        }
    });

cppnActivationFunctions.AddActivationFunction(
    "Sine2",
    {
        functionID:   'Sine2',
        functionString: "Sin(2*inputSignal)",
        functionDescription: "Sine function with doubled period",
        functionCalculate: function(inputSignal)
        {
            return Math.sin(2*inputSignal);
        },
        functionEnclose: function(stringToEnclose)
        {
            return "(Math.sin(2.0*(" + stringToEnclose + ")))";
        }
    });


cppnActivationFunctions.AddActivationFunction(
    "Sine",
    {
        functionID:   'Sine',
        functionString: "Sin(inputSignal)",
        functionDescription: "Sine function with normal period",
        functionCalculate: function(inputSignal)
        {
            return Math.sin(inputSignal);
        },
        functionEnclose: function(stringToEnclose)
        {
            return "(Math.sin(" + stringToEnclose + "))";
        }
    });

cppnActivationFunctions.AddActivationFunction(
    "StepFunction",
    {
        functionID:    'StepFunction',
        functionString: "x<=0 ? 0.0 : 1.0",
        functionDescription: "Step function [xrange -5.0,5.0][yrange, 0.0,1.0]",
        functionCalculate: function(inputSignal)
        {
            if(inputSignal<=0.0)
                return 0.0;
            else
                return 1.0;
        },
        functionEnclose: function(stringToEnclose)
        {
            return "(((" + stringToEnclose + ') <= 0.0) ? 0.0 : 1.0)';
        }
    });

});

require.register("optimuslime~cppnjs@master/networks/cppnConnection.js", function (exports, module) {
/**
 * Module dependencies.
 */
//none

/**
 * Expose `cppnConnection`.
 */

module.exports = cppnConnection;

/**
 * Initialize a new cppnConnection.
 *
 * @param {Number} sourceIdx
 * @param {Number} targetIdx
 * @param {Number} cWeight
 * @api public
 */
//simple connection type -- from FloatFastConnection.cs
function cppnConnection(
    sourceIdx,
    targetIdx,
    cWeight
    ){

    var self = this;
    self.sourceIdx =    sourceIdx;
    self.targetIdx =    targetIdx;
    self.weight = cWeight;
    self.signal =0;

}
});

require.register("optimuslime~cppnjs@master/networks/cppnNode.js", function (exports, module) {
/**
 * Module dependencies.
 */
var NodeType = require("optimuslime~cppnjs@master/types/nodeType.js");

/**
 * Expose `cppnNode`.
 */

module.exports = cppnNode;

/**
 * Initialize a new cppnNode.
 *
 * @param {String} actFn
 * @param {String} neurType
 * @param {String} nid
 * @api public
 */

function cppnNode(actFn, neurType, nid){

    var self = this;

    self.neuronType = neurType;
    self.id = nid;
    self.outputValue = (self.neuronType == NodeType.bias ? 1.0 : 0.0);
    self.activationFunction = actFn;

}
});

require.register("optimuslime~cppnjs@master/networks/cppn.js", function (exports, module) {
/**
 * Module dependencies.
 */

var utilities = require('optimuslime~cppnjs@master/utility/utilities.js');

/**
 * Expose `CPPN`.
 */

module.exports = CPPN;

/**
 * Initialize a new error view.
 *
 * @param {Number} biasNeuronCount
 * @param {Number} inputNeuronCount
 * @param {Number} outputNeuronCount
 * @param {Number} totalNeuronCount
 * @param {Array} connections
 * @param {Array} biasList
 * @param {Array} activationFunctions
 * @api public
 */
function CPPN(
    biasNeuronCount,
    inputNeuronCount,
    outputNeuronCount,
    totalNeuronCount,
    connections,
    biasList,
    activationFunctions
    )
{
    var self = this;

    // must be in the same order as neuronSignals. Has null entries for neurons that are inputs or outputs of a module.
    self.activationFunctions = activationFunctions;

    // The modules and connections are in no particular order; only the order of the neuronSignals is used for input and output methods.
    //floatfastconnections
    self.connections = connections;

    /// The number of bias neurons, usually one but sometimes zero. This is also the index of the first input neuron in the neuron signals.
    self.biasNeuronCount = biasNeuronCount;
    /// The number of input neurons.
    self.inputNeuronCount = inputNeuronCount;
    /// The number of input neurons including any bias neurons. This is also the index of the first output neuron in the neuron signals.
    self.totalInputNeuronCount = self.biasNeuronCount + self.inputNeuronCount;
    /// The number of output neurons.
    self.outputNeuronCount = outputNeuronCount;

    //save the total neuron count for us
    self.totalNeuronCount = totalNeuronCount;

    // For the following array, neurons are ordered with bias nodes at the head of the list,
    // then input nodes, then output nodes, and then hidden nodes in the array's tail.
    self.neuronSignals = [];
    self.modSignals = [];

    // This array is a parallel of neuronSignals, and only has values during SingleStepInternal().
    // It is declared here to avoid having to reallocate it for every network activation.
    self.neuronSignalsBeingProcessed = [];

    //initialize the neuron,mod, and processing signals
    for(var i=0; i < totalNeuronCount; i++){
        //either you are 1 for bias, or 0 otherwise
        self.neuronSignals.push(i < self.biasNeuronCount ? 1 : 0);
        self.modSignals.push(0);
        self.neuronSignalsBeingProcessed.push(0);
    }

    self.biasList = biasList;

    // For recursive activation, marks whether we have finished this node yet
    self.activated = [];
    // For recursive activation, makes whether a node is currently being calculated. For recurrant connections
    self.inActivation = [];
    // For recursive activation, the previous activation for recurrent connections
    self.lastActivation = [];


    self.adjacentList = [];
    self.reverseAdjacentList = [];
    self.adjacentMatrix = [];


    //initialize the activated, in activation, previous activation
    for(var i=0; i < totalNeuronCount; i++){
        self.activated.push(false);
        self.inActivation.push(false);
        self.lastActivation.push(0);

        //then we initialize our list of lists!
        self.adjacentList.push([]);
        self.reverseAdjacentList.push([]);

        self.adjacentMatrix.push([]);
        for(var j=0; j < totalNeuronCount; j++)
        {
            self.adjacentMatrix[i].push(0);
        }
    }

//        console.log(self.adjacentList.length);

    //finally
    // Set up adjacency list and matrix
    for (var i = 0; i < self.connections.length; i++)
    {
        var crs = self.connections[i].sourceIdx;
        var crt = self.connections[i].targetIdx;

        // Holds outgoing nodes
        self.adjacentList[crs].push(crt);

        // Holds incoming nodes
        self.reverseAdjacentList[crt].push(crs);

        self.adjacentMatrix[crs][crt] = connections[i].weight;
    }
}


/// <summary>
/// Using RelaxNetwork erodes some of the perofrmance gain of FastConcurrentNetwork because of the slightly
/// more complex implemementation of the third loop - whe compared to SingleStep().
/// </summary>
/// <param name="maxSteps"></param>
/// <param name="maxAllowedSignalDelta"></param>
/// <returns></returns>
CPPN.prototype.relaxNetwork = function(maxSteps, maxAllowedSignalDelta)
{
    var self = this;
    var isRelaxed = false;
    for (var j = 0; j < maxSteps && !isRelaxed; j++) {
        isRelaxed = self.singleStepInternal(maxAllowedSignalDelta);
    }
    return isRelaxed;
};

CPPN.prototype.setInputSignal = function(index, signalValue)
{
    var self = this;
    // For speed we don't bother with bounds checks.
    self.neuronSignals[self.biasNeuronCount + index] = signalValue;
};

CPPN.prototype.setInputSignals = function(signalArray)
{
    var self = this;
    // For speed we don't bother with bounds checks.
    for (var i = 0; i < signalArray.length; i++)
        self.neuronSignals[self.biasNeuronCount + i] = signalArray[i];
};

//we can dispense of this by accessing neuron signals directly
CPPN.prototype.getOutputSignal = function(index)
{
    // For speed we don't bother with bounds checks.
    return this.neuronSignals[this.totalInputNeuronCount + index];
};

//we can dispense of this by accessing neuron signals directly
CPPN.prototype.clearSignals = function()
{
    var self = this;
    // Clear signals for input, hidden and output nodes. Only the bias node is untouched.
    for (var i = self.biasNeuronCount; i < self.neuronSignals.length; i++)
        self.neuronSignals[i] = 0.0;
};

//    cppn.CPPN.prototype.TotalNeuronCount = function(){ return this.neuronSignals.length;};

CPPN.prototype.recursiveActivation = function(){

    var self = this;
    // Initialize boolean arrays and set the last activation signal, but only if it isn't an input (these have already been set when the input is activated)
    for (var i = 0; i < self.neuronSignals.length; i++)
    {
        // Set as activated if i is an input node, otherwise ensure it is unactivated (false)
        self.activated[i] = (i < self.totalInputNeuronCount) ? true : false;
        self.inActivation[i] = false;
        if (i >= self.totalInputNeuronCount)
            self.lastActivation[i] = self.neuronSignals[i];
    }

    // Get each output node activation recursively
    // NOTE: This is an assumption that genomes have started minimally, and the output nodes lie sequentially after the input nodes
    for (var i = 0; i < self.outputNeuronCount; i++)
        self.recursiveActivateNode(self.totalInputNeuronCount + i);

};


CPPN.prototype.recursiveActivateNode = function(currentNode)
{
    var self = this;
    // If we've reached an input node we return since the signal is already set
    if (self.activated[currentNode])
    {
        self.inActivation[currentNode] = false;
        return;
    }

    // Mark that the node is currently being calculated
    self.inActivation[currentNode] = true;

    // Set the presignal to 0
    self.neuronSignalsBeingProcessed[currentNode] = 0;

    // Adjacency list in reverse holds incoming connections, go through each one and activate it
    for (var i = 0; i < self.reverseAdjacentList[currentNode].length; i++)
    {
        var crntAdjNode = self.reverseAdjacentList[currentNode][i];

        //{ Region recurrant connection handling - not applicable in our implementation
        // If this node is currently being activated then we have reached a cycle, or recurrant connection. Use the previous activation in this case
        if (self.inActivation[crntAdjNode])
        {
            //console.log('using last activation!');
            self.neuronSignalsBeingProcessed[currentNode] += self.lastActivation[crntAdjNode]*self.adjacentMatrix[crntAdjNode][currentNode];
//                    parseFloat(
//                    parseFloat(self.lastActivation[crntAdjNode].toFixed(9)) * parseFloat(self.adjacentMatrix[crntAdjNode][currentNode].toFixed(9)).toFixed(9));
        }

        // Otherwise proceed as normal
        else
        {
            // Recurse if this neuron has not been activated yet
            if (!self.activated[crntAdjNode])
                self.recursiveActivateNode(crntAdjNode);

            // Add it to the new activation
            self.neuronSignalsBeingProcessed[currentNode] +=  self.neuronSignals[crntAdjNode] *self.adjacentMatrix[crntAdjNode][currentNode];
//                    parseFloat(
//                    parseFloat(self.neuronSignals[crntAdjNode].toFixed(9)) * parseFloat(self.adjacentMatrix[crntAdjNode][currentNode].toFixed(9)).toFixed(9));
        }
        //} endregion
    }

    // Mark this neuron as completed
    self.activated[currentNode] = true;

    // This is no longer being calculated (for cycle detection)
    self.inActivation[currentNode] = false;

//        console.log('Current node: ' + currentNode);
//        console.log('ActivationFunctions: ');
//        console.log(self.activationFunctions);
//
//        console.log('neuronSignals: ');
//        console.log(self.neuronSignals);
//
//        console.log('neuronSignalsBeingProcessed: ');
//        console.log(self.neuronSignalsBeingProcessed);
    // Set this signal after running it through the activation function
    self.neuronSignals[currentNode] = self.activationFunctions[currentNode].calculate(self.neuronSignalsBeingProcessed[currentNode]);
//            parseFloat((self.activationFunctions[currentNode].calculate(parseFloat(self.neuronSignalsBeingProcessed[currentNode].toFixed(9)))).toFixed(9));

};


CPPN.prototype.isRecursive = function()
{
    var self = this;

    //if we're a hidden/output node (nodeid >= totalInputcount), and we connect to an input node (nodeid <= self.totalInputcount) -- it's recurrent!
    //if we are a self connection, duh we are recurrent
    for(var c=0; c< self.connections.length; c++)
        if((self.connections[c].sourceIdx >= self.totalInputNeuronCount
            && self.connections[c].targetIdx < self.totalInputNeuronCount)
            || self.connections[c].sourceIdx == self.connections[c].targetIdx
            )
            return true;

    self.recursed = [];
    self.inRecursiveCheck = [];


    for(var i=0; i < self.neuronSignals.length; i++)
    {

        self.recursed.push((i < self.totalInputNeuronCount) ? true : false);
        self.inRecursiveCheck.push(false);
    }

    // Get each output node activation recursively
    // NOTE: This is an assumption that genomes have started minimally, and the output nodes lie sequentially after the input nodes
    for (var i = 0; i < self.outputNeuronCount; i++){
        if(self.recursiveCheckRecursive(self.totalInputNeuronCount + i))
        {
//                console.log('Returned one!');
            return true;

        }
    }

    return false;

};

CPPN.prototype.recursiveCheckRecursive = function(currentNode)
{
    var self = this;


//        console.log('Self recursed : '+ currentNode + ' ? ' +  self.recursed[currentNode]);

//        console.log('Checking: ' + currentNode)
    //  If we've reached an input node we return since the signal is already set
    if (self.recursed[currentNode])
    {
        self.inRecursiveCheck[currentNode] = false;
        return false;
    }

    // Mark that the node is currently being calculated
    self.inRecursiveCheck[currentNode] = true;

    // Adjacency list in reverse holds incoming connections, go through each one and activate it
    for (var i = 0; i < self.reverseAdjacentList[currentNode].length; i++)
    {
        var crntAdjNode = self.reverseAdjacentList[currentNode][i];

        //{ Region recurrant connection handling - not applicable in our implementation
        // If this node is currently being activated then we have reached a cycle, or recurrant connection. Use the previous activation in this case
        if (self.inRecursiveCheck[crntAdjNode])
        {
            self.inRecursiveCheck[currentNode] = false;
            return true;
        }

        // Otherwise proceed as normal
        else
        {
            var verifiedRecursive;
            // Recurse if this neuron has not been activated yet
            if (!self.recursed[crntAdjNode])
                verifiedRecursive = self.recursiveCheckRecursive(crntAdjNode);

            if(verifiedRecursive)
                return true;
        }
        //} endregion
    }

    // Mark this neuron as completed
    self.recursed[currentNode] = true;

    // This is no longer being calculated (for cycle detection)
    self.inRecursiveCheck[currentNode] = false;

    return false;
};





(function(exports, selfBrowser, isBrowser){

    var cppn = {CPPN: {}};







    //send in the object, and also whetehr or not this is nodejs
})(typeof exports === 'undefined'? this['cppnjs']['cppn']={}: exports, this, typeof exports === 'undefined'? true : false);

});

require.register("optimuslime~cppnjs@master/types/nodeType.js", function (exports, module) {
var NodeType =
{
    bias : "Bias",
    input: "Input",
    output: "Output",
    hidden: "Hidden",
    other : "Other"
};

module.exports = NodeType;

});

require.register("optimuslime~cppnjs@master/utility/utilities.js", function (exports, module) {
var utils = {};

module.exports = utils;

utils.stringToFunction = function(str) {
    var arr = str.split(".");

    var fn = (window || this);
    for (var i = 0, len = arr.length; i < len; i++) {
        fn = fn[arr[i]];
    }

    if (typeof fn !== "function") {
        throw new Error("function not found");
    }

    return  fn;
};

utils.nextDouble = function()
{
    return Math.random();
};

utils.next = function(range)
{
    return Math.floor((Math.random()*range));
};

utils.tanh = function(arg) {
    // sinh(number)/cosh(number)
    return (Math.exp(arg) - Math.exp(-arg)) / (Math.exp(arg) + Math.exp(-arg));
};

utils.sign = function(input)
{
    if (input < 0) {return -1;}
    if (input > 0) {return 1;}
    return 0;
};

//ROULETTE WHEEL class


//if we need a node object, this is how we would do it
//    var neatNode = isNodejs ? self['neatNode'] : require('./neatNode.js');
utils.RouletteWheel =
{

};

/// <summary>
/// A simple single throw routine.
/// </summary>
/// <param name="probability">A probability between 0..1 that the throw will result in a true result.</param>
/// <returns></returns>
utils.RouletteWheel.singleThrow = function(probability)
{
    return (utils.nextDouble() <= probability);
};



/// <summary>
/// Performs a single throw for a given number of outcomes with equal probabilities.
/// </summary>
/// <param name="numberOfOutcomes"></param>
/// <returns>An integer between 0..numberOfOutcomes-1. In effect this routine selects one of the possible outcomes.</returns>

utils.RouletteWheel.singleThrowEven = function(numberOfOutcomes)
{
    var probability= 1.0 / numberOfOutcomes;
    var accumulator=0;
    var throwValue = utils.nextDouble();

    for(var i=0; i<numberOfOutcomes; i++)
    {
        accumulator+=probability;
        if(throwValue<=accumulator)
            return i;
    }
    //throw exception in javascript
    throw "PeannutLib.Maths.SingleThrowEven() - invalid outcome.";
};

/// <summary>
/// Performs a single thrown onto a roulette wheel where the wheel's space is unevenly divided.
/// The probabilty that a segment will be selected is given by that segment's value in the 'probabilities'
/// array. The probabilities are normalised before tossing the ball so that their total is always equal to 1.0.
/// </summary>
/// <param name="probabilities"></param>
/// <returns></returns>
utils.RouletteWheel.singleThrowArray = function(aProbabilities)
{
    if(typeof aProbabilities === 'number')
        throw new Error("Send Array to singleThrowArray!");
    var pTotal=0;	// Total probability

    //-----
    for(var i=0; i<aProbabilities.length; i++)
        pTotal+= aProbabilities[i];

    //----- Now throw the ball and return an integer indicating the outcome.
    var throwValue = utils.nextDouble() * pTotal;
    var accumulator=0;

    for(var j=0; j< aProbabilities.length; j++)
    {
        accumulator+= aProbabilities[j];

        if(throwValue<=accumulator)
            return j;
    }

    throw "PeannutLib.Maths.singleThrowArray() - invalid outcome.";
};

/// <summary>
/// Similar in functionality to SingleThrow(double[] probabilities). However the 'probabilities' array is
/// not normalised. Therefore if the total goes beyond 1 then we allow extra throws, thus if the total is 10
/// then we perform 10 throws.
/// </summary>
/// <param name="probabilities"></param>
/// <returns></returns>
utils.RouletteWheel.multipleThrows = function(aProbabilities)
{
    var pTotal=0;	// Total probability
    var numberOfThrows;

    //----- Determine how many throws of the ball onto the wheel.
    for(var i=0; i<aProbabilities.length; i++)
        pTotal+=aProbabilities[i];

    // If total probabilty is > 1 then we take this as meaning more than one throw of the ball.
    var pTotalInteger = Math.floor(pTotal);
    var pTotalRemainder = pTotal - pTotalInteger;
    numberOfThrows = Math.floor(pTotalInteger);

    if(utils.nextDouble() <= pTotalRemainder)
        numberOfThrows++;

    //----- Now throw the ball the determined number of times. For each throw store an integer indicating the outcome.
    var outcomes = [];//new int[numberOfThrows];
    for(var a=0; a < numberOfThrows; a++)
        outcomes.push(0);

    for(var i=0; i<numberOfThrows; i++)
    {
        var throwValue = utils.nextDouble() * pTotal;
        var accumulator=0;

        for(var j=0; j<aProbabilities.length; j++)
        {
            accumulator+=aProbabilities[j];

            if(throwValue<=accumulator)
            {
                outcomes[i] = j;
                break;
            }
        }
    }

    return outcomes;
};
utils.RouletteWheel.selectXFromSmallObject = function(x, objects){
    var ixs = [];
    //works with objects with count or arrays with length
    var gCount = objects.count === undefined ? objects.length : objects.count;

    for(var i=0; i<gCount;i++)
        ixs.push(i);

    //how many do we need back? we need x back. So we must remove (# of objects - x) leaving ... x objects
    for(var i=0; i < gCount -x; i++)
    {
        //remove random index
        ixs.splice(utils.next(ixs.length),1);
    }

    return ixs;
};
utils.RouletteWheel.selectXFromLargeObject = function(x, objects)
{
    var ixs = [];
    var guesses = {};
    var gCount = objects.count === undefined ? objects.length : objects.count;

    //we make sure the number of requested objects is less than the object indices
    x = Math.min(x, gCount);

    for(var i=0; i<x; i++)
    {
        var guessIx = utils.next(gCount);
        while(guesses[guessIx])
            guessIx = utils.next(gCount);

        guesses[guessIx] = true;
        ixs.push(guessIx);
    }

    return ixs;
};

});

require.register("optimuslime~cppnjs@master/extras/adaptableAdditions.js", function (exports, module) {
//The purpose of this file is to only extend CPPNs to have additional activation capabilities involving mod connections

var cppnConnection = require("optimuslime~cppnjs@master/networks/cppnConnection.js");
//default all the variables that need to be added to handle adaptable activation
var connectionPrototype = cppnConnection.prototype;
connectionPrototype.a = 0;
connectionPrototype.b = 0;
connectionPrototype.c = 0;
connectionPrototype.d = 0;
connectionPrototype.modConnection = 0;
connectionPrototype.learningRate = 0;


var CPPN = require("optimuslime~cppnjs@master/networks/cppn.js");
//default all the variables that need to be added to handle adaptable activation
var cppnPrototype = CPPN.prototype;

cppnPrototype.a = 0;
cppnPrototype.b = 0;
cppnPrototype.c = 0;
cppnPrototype.d = 0;
cppnPrototype.learningRate = 0;
cppnPrototype.pre = 0;
cppnPrototype.post = 0;

cppnPrototype.adaptable = false;
cppnPrototype.modulatory = false;


/// <summary>
/// This function carries out a single network activation.
/// It is called by all those methods that require network activations.
/// </summary>
/// <param name="maxAllowedSignalDelta">
/// The network is not relaxed as long as the absolute value of the change in signals at any given point is greater than this value.
/// Only positive values are used. If the value is less than or equal to 0, the method will return true without checking for relaxation.
/// </param>
/// <returns>True if the network is relaxed, or false if not.</returns>
cppnPrototype.singleStepInternal = function(maxAllowedSignalDelta)
{
    var isRelaxed = true;	// Assume true.
    var self = this;
    // Calculate each connection's output signal, and add the signals to the target neurons.
    for (var i = 0; i < self.connections.length; i++) {

        if (self.adaptable)
        {
            if (self.connections[i].modConnection <= 0.0)   //Normal connection
            {
                self.neuronSignalsBeingProcessed[self.connections[i].targetIdx] += self.neuronSignals[self.connections[i].sourceIdx] * self.connections[i].weight;
            }
            else //modulatory connection
            {
                self.modSignals[self.connections[i].targetIdx] += self.neuronSignals[self.connections[i].sourceIdx] * self.connections[i].weight;

            }
        }
        else
        {
            self.neuronSignalsBeingProcessed[self.connections[i].targetIdx] += self.neuronSignals[self.connections[i].sourceIdx] * self.connections[i].weight;

        }
    }

    // Pass the signals through the single-valued activation functions.
    // Do not change the values of input neurons or neurons that have no activation function because they are part of a module.
    for (var i = self.totalInputNeuronCount; i < self.neuronSignalsBeingProcessed.length; i++) {
        self.neuronSignalsBeingProcessed[i] = self.activationFunctions[i].calculate(self.neuronSignalsBeingProcessed[i]+self.biasList[i]);
        if (self.modulatory)
        {
            //Make sure it's between 0 and 1
            self.modSignals[i] += 1.0;
            if (self.modSignals[i]!=0.0)
                self.modSignals[i] = utilities.tanh(self.modSignals[i]);//Tanh(modSignals[i]);//(Math.Exp(2 * modSignals[i]) - 1) / (Math.Exp(2 * modSignals[i]) + 1));
        }
    }
    //TODO Modules not supported in this implementation - don't care


    /*foreach (float f in neuronSignals)
     HyperNEATParameters.distOutput.Write(f.ToString("R") + " ");
     HyperNEATParameters.distOutput.WriteLine();
     HyperNEATParameters.distOutput.Flush();*/

    // Move all the neuron signals we changed while processing this network activation into storage.
    if (maxAllowedSignalDelta > 0) {
        for (var i = self.totalInputNeuronCount; i < self.neuronSignalsBeingProcessed.length; i++) {

            // First check whether any location in the network has changed by more than a small amount.
            isRelaxed &= (Math.abs(self.neuronSignals[i] - self.neuronSignalsBeingProcessed[i]) > maxAllowedSignalDelta);

            self.neuronSignals[i] = self.neuronSignalsBeingProcessed[i];
            self.neuronSignalsBeingProcessed[i] = 0.0;
        }
    } else {
        for (var i = self.totalInputNeuronCount; i < self.neuronSignalsBeingProcessed.length; i++) {
            self.neuronSignals[i] = self.neuronSignalsBeingProcessed[i];
            self.neuronSignalsBeingProcessed[i] = 0.0;
        }
    }

    // Console.WriteLine(inputNeuronCount);

    if (self.adaptable)//CPPN != null)
    {
        var coordinates = [0,0,0,0];
        var modValue;
        var weightDelta;
        for (var i = 0; i < self.connections.length; i++)
        {
            if (self.modulatory)
            {
                self.pre = self.neuronSignals[self.connections[i].sourceIdx];
                self.post = self.neuronSignals[self.connections[i].targetIdx];
                modValue = self.modSignals[self.connections[i].targetIdx];

                self.a = self.connections[i].a;
                self.b = self.connections[i].b;
                self.c = self.connections[i].c;
                self.d = self.connections[i].d;

                self.learningRate = self.connections[i].learningRate;
                if (modValue != 0.0 && (self.connections[i].modConnection <= 0.0))        //modulate target neuron if its a normal connection
                {
                    self.connections[i].weight += modValue*self.learningRate * (self.a * self.pre * self.post + self.b * self.pre + self.c * self.post + self.d);
                }

                if (Math.abs(self.connections[i].weight) > 5.0)
                {
                    self.connections[i].weight = 5.0 * Math.sign(self.connections[i].weight);
                }
            }
            else
            {
                self.pre = self.neuronSignals[self.connections[i].sourceIdx];
                self.post = self.neuronSignals[self.connections[i].targetIdx];
                self.a = self.connections[i].a;
                self.b = self.connections[i].b;
                self.c = self.connections[i].c;

                self.learningRate = self.connections[i].learningRate;

                weightDelta = self.learningRate * (self.a * self.pre * self.post + self.b * self.pre + self.c * self.post);
                connections[i].weight += weightDelta;

                //   Console.WriteLine(pre + " " + post + " " + learningRate + " " + A + " " + B + " " + C + " " + weightDelta);

                if (Math.abs(self.connections[i].weight) > 5.0)
                {
                    self.connections[i].weight = 5.0 * Math.sign(self.connections[i].weight);
                }
            }
        }
    }

    for (var i = self.totalInputNeuronCount; i < self.neuronSignalsBeingProcessed.length; i++)
    {
        self.modSignals[i] = 0.0;
    }

    return isRelaxed;

};


cppnPrototype.singleStep = function(finished)
{
    var self = this;
    self.singleStepInternal(0.0); // we will ignore the value of this function, so the "allowedDelta" argument doesn't matter.
    if (finished)
    {
        finished(null);
    }
};

cppnPrototype.multipleSteps = function(numberOfSteps)
{
    var self = this;
    for (var i = 0; i < numberOfSteps; i++) {
        self.singleStep();
    }
};

});

require.register("optimuslime~cppnjs@master/extras/pureCPPNAdditions.js", function (exports, module) {
//The purpose of this file is to only extend CPPNs to have additional activation capabilities involving turning
//cppns into a string!

var CPPN = require("optimuslime~cppnjs@master/networks/cppn.js");

//for convenience, you can require pureCPPNAdditions
module.exports = CPPN;

var CPPNPrototype = CPPN.prototype;

CPPNPrototype.createPureCPPNFunctions = function()
{

    var self = this;

    //create our enclosed object for each node! (this way we actually have subnetworks functions setup too
    self.nEnclosed = new Array(self.neuronSignals.length);

    self.bAlreadyEnclosed = new Array(self.neuronSignals.length);
    self.inEnclosure = new Array(self.neuronSignals.length);

    // Initialize boolean arrays and set the last activation signal, but only if it isn't an input (these have already been set when the input is activated)
    for (var i = 0; i < self.nEnclosed.length; i++)
    {
        // Set as activated if i is an input node, otherwise ensure it is unactivated (false)
        self.bAlreadyEnclosed[i] = (i < self.totalInputNeuronCount) ? true : false;
        self.nEnclosed[i] = (i < self.totalInputNeuronCount ? "x" + i : "");

        self.inEnclosure[i] = false;

    }

    // Get each output node activation recursively
    // NOTE: This is an assumption that genomes have started minimally, and the output nodes lie sequentially after the input nodes
    for (var i = 0; i < self.outputNeuronCount; i++){

//            for (var m = 0; m < self.nEnclosed.length; m++)
//            {
//                // Set as activated if i is an input node, otherwise ensure it is unactivated (false)
//                self.bAlreadyEnclosed[m] = (m < self.totalInputNeuronCount) ? true : false;
//                self.inEnclosure[m] = false;
//            }


        self.nrEncloseNode(self.totalInputNeuronCount + i);

    }

//        console.log(self.nEnclosed);

    //now grab our ordered objects
    var orderedObjects = self.recursiveCountThings();

//        console.log(orderedObjects);

    //now let's build our functions
    var nodeFunctions = {};

    var stringFunctions = {};

    var emptyNodes = {};

    for(var i= self.totalInputNeuronCount; i < self.totalNeuronCount; i++)
    {
        //skip functions that aren't defined
        if(!self.bAlreadyEnclosed[i]){
            emptyNodes[i] = true;
            continue;
        }

        var fnString = "return " + self.nEnclosed[i] + ';';
        nodeFunctions[i] = new Function([], fnString);
        stringFunctions[i] = fnString;
    }

    var inOrderAct = [];
    //go through and grab the indices -- no need for rank and things
    orderedObjects.forEach(function(oNode)
    {
        if(!emptyNodes[oNode.node])
            inOrderAct.push(oNode.node);
    });


    var containedFunction = function(nodesInOrder, functionsForNodes, biasCount, outputCount)
    {
        return function(inputs)
        {
            var bias = 1.0;
            var context = {};
            context.rf = new Array(nodesInOrder.length);
            var totalIn = inputs.length + biasCount;

            for(var i=0; i < biasCount; i++)
                context.rf[i] = bias;

            for(var i=0; i < inputs.length; i++)
                context.rf[i+biasCount] = inputs[i];


            for(var i=0; i < nodesInOrder.length; i++)
            {
                var fIx = nodesInOrder[i];
//                console.log('Ix to hit: ' fIx + );
                context.rf[fIx] = (fIx < totalIn ? context.rf[fIx] : functionsForNodes[fIx].call(context));
            }

            return context.rf.slice(totalIn, totalIn + outputCount);
        }
    };

    //this will return a function that can be run by calling var outputs = functionName(inputs);
    var contained =  containedFunction(inOrderAct, nodeFunctions, self.biasNeuronCount, self.outputNeuronCount);

    return {contained: contained, stringFunctions: stringFunctions, arrayIdentifier: "this.rf", nodeOrder: inOrderAct};


//        console.log(self.nEnclosed[self.totalInputNeuronCount + 0].length);
//        console.log('Enclosed nodes: ');
//        console.log(self.nEnclosed);

//        console.log('Ordered: ');
//        console.log(orderedActivation);

};



CPPNPrototype.nrEncloseNode = function(currentNode)
{
    var self = this;

    // If we've reached an input node we return since the signal is already set

//        console.log('Checking: ' + currentNode);
//        console.log('Total: ');
//        console.log(self.totalInputNeuronCount);


    if (currentNode < self.totalInputNeuronCount)
    {
        self.inEnclosure[currentNode] = false;
        self[currentNode] = 'this.rf[' + currentNode + ']';
        return;
    }
    if (self.bAlreadyEnclosed[currentNode])
    {
        self.inEnclosure[currentNode] = false;
        return;
    }

    // Mark that the node is currently being calculated
    self.inEnclosure[currentNode] = true;

    // Adjacency list in reverse holds incoming connections, go through each one and activate it
    for (var i = 0; i < self.reverseAdjacentList[currentNode].length; i++)
    {
        var crntAdjNode = self.reverseAdjacentList[currentNode][i];

        //{ Region recurrant connection handling - not applicable in our implementation
        // If this node is currently being activated then we have reached a cycle, or recurrant connection. Use the previous activation in this case
        if (self.inEnclosure[crntAdjNode])
        {
            //easy fix, this isn't meant for recurrent networks -- just throw an error!
            throw new Error("Method not built for recurrent networks!");
        }

        // Otherwise proceed as normal
        else
        {

            // Recurse if this neuron has not been activated yet
            if (!self.bAlreadyEnclosed[crntAdjNode])
                self.nrEncloseNode(crntAdjNode);

//                console.log('Next: ');
//                console.log(crntAdjNode);
//                console.log(self.nEnclosed[crntAdjNode]);

            var add = (self.nEnclosed[currentNode] == "" ? "(" : "+");

            //get our weight from adjacency matrix
            var weight = self.adjacentMatrix[crntAdjNode][currentNode];

            //we have a whole number weight!
            if(Math.round(weight) === weight)
                weight = '' + weight + '.0';
            else
                weight = '' + weight;


            // Add it to the new activation
            self.nEnclosed[currentNode] += add + weight + "*" + "this.rf[" + crntAdjNode + "]";

        }
        //} endregion
//            nodeCount++;
    }

    //if we're empty, we're empty! We don't go no where, derrrr
    if(self.nEnclosed[currentNode] === '')
        self.nEnclosed[currentNode] = '0.0';
    else
        self.nEnclosed[currentNode] += ')';

    // Mark this neuron as completed
    self.bAlreadyEnclosed[currentNode] = true;

    // This is no longer being calculated (for cycle detection)
    self.inEnclosure[currentNode] = false;


//        console.log('Enclosed legnth: ' + self.activationFunctions[currentNode].enclose(self.nEnclosed[currentNode]).length);

    self.nEnclosed[currentNode] = self.activationFunctions[currentNode].enclose(self.nEnclosed[currentNode]);

};

CPPNPrototype.recursiveCountThings = function()
{
    var self= this;

    var orderedActivation = {};

    var higherLevelRecurse = function(neuron)
    {
        var inNode = new Array(self.totalNeuronCount);
        var nodeCount = new Array(self.totalNeuronCount);
        var interactCount = new Array(self.totalNeuronCount);

        for(var s=0; s < self.totalNeuronCount; s++) {
            inNode[s] = false;
            nodeCount[s] = 0;
            interactCount[s] = 0;
        }

        var recurseNode = function(currentNode)
        {
            // Mark that the node is currently being calculated
            inNode[currentNode] = true;

            var recurse = {};

            // Adjacency list in reverse holds incoming connections, go through each one and activate it
            for (var i = 0; i < self.reverseAdjacentList[currentNode].length; i++)
            {
                var crntAdjNode = self.reverseAdjacentList[currentNode][i];


                recurse[i] = (nodeCount[crntAdjNode] < nodeCount[currentNode] + 1);

                nodeCount[crntAdjNode] = Math.max(nodeCount[crntAdjNode], nodeCount[currentNode] + 1);

            }
            //all nodes are marked with correct count, let's continue backwards for each one!
            for (var i = 0; i < self.reverseAdjacentList[currentNode].length; i++)
            {
                var crntAdjNode = self.reverseAdjacentList[currentNode][i];

                if(recurse[i])
                // Recurse on it! -- already marked above
                    recurseNode(crntAdjNode);

            }

            //            nodeCount[currentNode] = nodeCount[currentNode] + 1;
            inNode[currentNode] = false;

        };

        recurseNode(neuron);

        return nodeCount;
    };


    var orderedObjects = new Array(self.totalNeuronCount);

    // Get each output node activation recursively
    // NOTE: This is an assumption that genomes have started minimally, and the output nodes lie sequentially after the input nodes
    for (var m = 0; m < self.outputNeuronCount; m++){
        //we have ordered count for this output!

        var olist = higherLevelRecurse(self.totalInputNeuronCount + m);

        var nodeSpecificOrdering  = [];

        for(var n=0; n< olist.length; n++)
        {
            //we take the maximum depending on whether or not it's been seen before
            if(orderedObjects[n])
                orderedObjects[n] = {node: n, rank: Math.max(orderedObjects[n].rank, olist[n])};
            else
                orderedObjects[n] = {node: n, rank: olist[n]};

            nodeSpecificOrdering.push({node: n, rank: olist[n]});
        }

        nodeSpecificOrdering.sort(function(a,b){return b.rank - a.rank;});

        orderedActivation[self.totalInputNeuronCount + m] = nodeSpecificOrdering;
    }


    orderedObjects.sort(function(a,b){return b.rank - a.rank;});
//        console.log(orderedObjects);


    return orderedObjects;

};
});

require.register("optimuslime~cppnjs@master/extras/gpuAdditions.js", function (exports, module) {
//this takes in cppn functions, and outputs a shader....
//radical!
//needs to be tested more! How large can CPPNs get? inputs/outputs/hiddens?
//we'll extend a CPPN to produce a GPU shader
var CPPN = require("optimuslime~cppnjs@master/networks/cppn.js");

var CPPNPrototype = CPPN.prototype;

var cppnToGPU = {};
cppnToGPU.ShaderFragments = {};

cppnToGPU.ShaderFragments.passThroughVariables =
    [
        "uniform float texelWidth;",
        "uniform float texelHeight;"

    ].join('\n');

//simple, doesn't do anything but pass on uv coords to the frag shaders
cppnToGPU.ShaderFragments.passThroughVS =
    [
        cppnToGPU.ShaderFragments.passThroughVariables,
        "varying vec2 passCoord;",

        "void main()	{",
        "passCoord = uv;",
        "gl_Position = vec4( position, 1.0 );",
        "}",
        "\n"
    ].join('\n');

cppnToGPU.ShaderFragments.passThroughVS3x3 =
    [
        cppnToGPU.ShaderFragments.passThroughVariables,
        "varying vec2 sampleCoords[9];",

        "void main()	{",

        "gl_Position = vec4( position, 1.0 );",

        "vec2 widthStep = vec2(texelWidth, 0.0);",
        "vec2 heightStep = vec2(0.0, texelHeight);",
        "vec2 widthHeightStep = vec2(texelWidth, texelHeight);",
        "vec2 widthNegativeHeightStep = vec2(texelWidth, -texelHeight);",

        "vec2 inputTextureCoordinate = uv;",

        "sampleCoords[0] = inputTextureCoordinate.xy;",
        "sampleCoords[1] = inputTextureCoordinate.xy - widthStep;",
        "sampleCoords[2] = inputTextureCoordinate.xy + widthStep;",

        "sampleCoords[3] = inputTextureCoordinate.xy - heightStep;",
        "sampleCoords[4] = inputTextureCoordinate.xy - widthHeightStep;",
        "sampleCoords[5] = inputTextureCoordinate.xy + widthNegativeHeightStep;",

        "sampleCoords[6] = inputTextureCoordinate.xy + heightStep;",
        "sampleCoords[7] = inputTextureCoordinate.xy - widthNegativeHeightStep;",
        "sampleCoords[8] = inputTextureCoordinate.xy + widthHeightStep;",

        "}",
        "\n"
    ].join('\n');


cppnToGPU.ShaderFragments.variables =
    [
        "varying vec2 passCoord; ",
        "uniform sampler2D inputTexture; "
    ].join('\n');

cppnToGPU.ShaderFragments.variables3x3 =
    [
        "varying vec2 sampleCoords[9];",
        "uniform sampler2D inputTexture; "
    ].join('\n');


//this is a generic conversion from cppn to shader
//Extends the CPPN object to have fullShaderFromCPPN function (and a callback to add any extras)
//the extras will actually dictate how the final output is created and used
CPPNPrototype.fullShaderFromCPPN = function(specificAddFunction)
{
    var cppn = this;

//        console.log('Decoded!');
//        console.log('Start enclose :)');
    var functionObject = cppn.createPureCPPNFunctions();
//        console.log('End enclose!');
    //functionobject of the form
//        {contained: contained, stringFunctions: stringFunctions, arrayIdentifier: "this.rf", nodeOrder: inOrderAct};

    var multiInput = cppn.inputNeuronCount >= 27;


    var totalNeurons = cppn.totalNeuronCount;

    var inorderString = "";

    var lastIx = functionObject.nodeOrder[totalNeurons-1];
    functionObject.nodeOrder.forEach(function(ix)
    {
        inorderString += ix +  (ix !== lastIx ? "," : "");
    });

    var defaultVariables = multiInput ? cppnToGPU.ShaderFragments.variables3x3 : cppnToGPU.ShaderFragments.variables;

    //create a float array the size of the neurons
//        var fixedArrayDec = "int order[" + totalNeurons + "](" + inorderString + ");";
    var arrayDeclaration = "float register[" + totalNeurons + "];";


    var beforeFunctionIx = "void f";
    var functionWrap = "(){";

    var postFunctionWrap = "}";

    var repString = functionObject.arrayIdentifier;
    var fns = functionObject.stringFunctions;
    var wrappedFunctions = [];
    for(var key in fns)
    {
        if(key < cppn.totalInputNeuronCount)
            continue;

        //do this as 3 separate lines
        var wrap = beforeFunctionIx + key + functionWrap;
        wrappedFunctions.push(wrap);
        var setRegister = "register[" + key + "] = ";

        var repFn =  fns[key].replace(new RegExp(repString, 'g'), "register");
        //remove all Math. references -- e.g. Math.sin == sin in gpu code
        repFn = repFn.replace(new RegExp("Math.", 'g'), "");
        //we don't want a return function, fs are void
        repFn = repFn.replace(new RegExp("return ", 'g'), "");
        //anytime you see a +-, this actually means -
        //same goes for -- this is a +
        repFn = repFn.replace(new RegExp("\\+\\-", 'g'), "-");
        repFn = repFn.replace(new RegExp("\\-\\-", 'g'), "+");

        wrappedFunctions.push(setRegister + repFn);
        wrappedFunctions.push(postFunctionWrap);
    }

    var activation = [];

    var actBefore, additionalParameters;

    if(cppn.outputNeuronCount == 1)
    {
        actBefore = "float";
        additionalParameters = "";
    }
    else
    {
//            actBefore = "float[" + ng.outputNodeCount + "]";
        actBefore = "void";
        additionalParameters = ", out float[" + cppn.outputNeuronCount + "] outputs";
    }

    actBefore += " activate(float[" +cppn.inputNeuronCount + "] fnInputs" + additionalParameters+ "){";
    activation.push(actBefore);

    var bCount = cppn.biasNeuronCount;

    for(var i=0; i < bCount; i++)
    {
        activation.push('register[' + i + '] = 1.0;');
    }
    for(var i=0; i < cppn.inputNeuronCount; i++)
    {
        activation.push('register[' + (i + bCount) + '] = fnInputs[' + i + '];');
    }

    functionObject.nodeOrder.forEach(function(ix)
    {
        if(ix >= cppn.totalInputNeuronCount)
            activation.push("f"+ix +"();");
    });

    var outputs;

    //if you're just one output, return a simple float
    //otherwise, you need to return an array
    if(cppn.outputNeuronCount == 1)
    {
        outputs = "return register[" + cppn.totalInputNeuronCount + "];";
    }
    else
    {
        var multiOut = [];

//            multiOut.push("float o[" + ng.outputNodeCount + "];");
        for(var i=0; i < cppn.outputNeuronCount; i++)
            multiOut.push("outputs[" + i + "] = register[" + (i + cppn.totalInputNeuronCount) + "];");
//            multiOut.push("return o;");

        outputs = multiOut.join('\n');
    }

    activation.push(outputs);
    activation.push("}");

    var additional = specificAddFunction(cppn);


    return {vertex: multiInput ?
        cppnToGPU.ShaderFragments.passThroughVS3x3 :
        cppnToGPU.ShaderFragments.passThroughVS,
        fragment: [defaultVariables,arrayDeclaration].concat(wrappedFunctions).concat(activation).concat(additional).join('\n')};

};


});

require.register("optimuslime~win-utils@master", function (exports, module) {

var winutils = {};

module.exports = winutils;

//right now, it's all we have setup -- later there will be more utilities
winutils.cuid = require('optimuslime~win-utils@master/uuid/cuid.js');

winutils.math = require('optimuslime~win-utils@master/math/winmath.js');


});

require.register("optimuslime~win-utils@master/uuid/cuid.js", function (exports, module) {
/**
 * cuid.js
 * Collision-resistant UID generator for browsers and node.
 * Sequential for fast db lookups and recency sorting.
 * Safe for element IDs and server-side lookups.
 *
 * Extracted from CLCTR
 * 
 * Copyright (c) Eric Elliott 2012
 * MIT License
 */
//From: https://github.com/dilvie/cuid

//note that module.exports is at the end -- it exports the api variable

/*global window, navigator, document, require, process, module */
var c = 0,
    blockSize = 4,
    base = 36,
    discreteValues = Math.pow(base, blockSize),

    pad = function pad(num, size) {
      var s = "000000000" + num;
      return s.substr(s.length-size);
    },

    randomBlock = function randomBlock() {
      return pad((Math.random() *
            discreteValues << 0)
            .toString(base), blockSize);
    },

    api = function cuid() {
      // Starting with a lowercase letter makes
      // it HTML element ID friendly.
      var letter = 'c', // hard-coded allows for sequential access

        // timestamp
        // warning: this exposes the exact date and time
        // that the uid was created.
        timestamp = (new Date().getTime()).toString(base),

        // Prevent same-machine collisions.
        counter,

        // A few chars to generate distinct ids for different
        // clients (so different computers are far less
        // likely to generate the same id)
        fingerprint = api.fingerprint(),

        // Grab some more chars from Math.random()
        random = randomBlock() + randomBlock() + randomBlock() + randomBlock();

        c = (c < discreteValues) ? c : 0;
        counter = pad(c.toString(base), blockSize);

      c++; // this is not subliminal

      return  (letter + timestamp + counter + fingerprint + random);
    };

api.slug = function slug() {
  var date = new Date().getTime().toString(36),
    counter = c.toString(36).slice(-1),
    print = api.fingerprint().slice(0,1) +
      api.fingerprint().slice(-1),
    random = randomBlock().slice(-1);

  c++;

  return date.slice(2,4) + date.slice(-2) + 
    counter + print + random;
};

//fingerprint changes based on nodejs or component setup
var isBrowser = (typeof process == 'undefined');

api.fingerprint = isBrowser ?
  function browserPrint() {
      return pad((navigator.mimeTypes.length +
          navigator.userAgent.length).toString(36) +
          api.globalCount().toString(36), 4);
  }
: function nodePrint() {
  var os = require('os'),

  padding = 2,
  pid = pad((process.pid).toString(36), padding),
  hostname = os.hostname(),
  length = hostname.length,
  hostId = pad((hostname)
    .split('')
    .reduce(function (prev, char) {
      return +prev + char.charCodeAt(0);
    }, +length + 36)
    .toString(36),
  padding);
return pid + hostId;
};

api.globalCount = function globalCount() {
    // We want to cache the results of this
    var cache = (function calc() {
        var i,
            count = 0;

            //global count only ever called inside browser environment
            //lets loop through and count the keys in window -- then cahce that as part of our fingerprint
        for (i in window) {
            count++;
        }

        return count;
    }());

    api.globalCount = function () { return cache; };
    return cache;
};

api.isLessThan = function(first, second)
{
  var fParse= parseInt(first);
  var sParse = parseInt(second);
  if(isNaN(fParse) && isNaN(sParse))
  {
     //tease apart first, second to determine which ID came first
    //counter + fingerprint + random = 6 blocks of 4 = 24
    var dateEnd = 6*blockSize;
    var counterEnd = 5*blockSize;
    var charStart = 1;

    //convert the base-36 time string to base 10 number -- parseint handles this by sending in the original radix
    var firstTime = parseInt(first.slice(charStart, first.length - dateEnd), base);
    //ditto for counter
    var firstCounter = parseInt(first.slice(first.length - dateEnd, first.length - counterEnd),base);

    //convert the base-36 time string to base 10 number -- parseint handles this by sending in the original radix
    var secondTime =  parseInt(second.slice(charStart, second.length - dateEnd), base);
    
    //ditto for counter 
    var secondCounter = parseInt(second.slice(second.length - dateEnd, second.length - counterEnd), base);

    //either the first time is less than the second time, and we answer this question immediately
    //or the times are equal -- then we pull the lower counter
    //techincially counters can wrap, but this won't happen very often AND this is all for measuring disjoint/excess behavior
    //the time should be enough of an ordering principal for this not to matter
    return firstTime < secondTime || (firstTime == secondTime && firstCounter < secondCounter);

  }
  else if(isNaN(sParse))
  {
    //if sParse is a string, then the first is a number and the second is a string UUID
    //to maintain backwards compat -- number come before strings in neatjs ordering
    return true;
  }//both are not NaN -- we have two numbers to compare
  else
  {
    return fParse < sParse;
  }
}

//we send out API
module.exports = api;




});

require.register("optimuslime~win-utils@master/math/winmath.js", function (exports, module) {

var mathHelper = {};

module.exports = mathHelper;

mathHelper.next = function(max)
{
    return Math.floor(Math.random()*max);
};

});

require.register("neatjs", function (exports, module) {
var neatjs = {};

//export the cppn library
module.exports = neatjs;

//nodes and connections!
neatjs.neatNode = require('neatjs/genome/neatNode.js');
neatjs.neatConnection = require('neatjs/genome/neatConnection.js');
neatjs.neatGenome = require('neatjs/genome/neatGenome.js');

//all the activations your heart could ever hope for
neatjs.iec = require('neatjs/evolution/iec.js');
neatjs.multiobjective = require('neatjs/evolution/multiobjective.js');
neatjs.novelty = require('neatjs/evolution/novelty.js');

//neatHelp
neatjs.neatDecoder = require('neatjs/neatHelp/neatDecoder.js');
neatjs.neatHelp = require('neatjs/neatHelp/neatHelp.js');
neatjs.neatParameters = require('neatjs/neatHelp/neatParameters.js');

//and the utilities to round it out!
neatjs.genomeSharpToJS = require('neatjs/utility/genomeSharpToJS.js');

//exporting the node type
neatjs.NodeType = require('neatjs/types/nodeType.js');



});

require.register("neatjs/evolution/iec.js", function (exports, module) {
/**
 * Module dependencies.
 */

var NeatGenome = require('neatjs/genome/neatGenome.js');

//pull in variables from cppnjs
var cppnjs = require('optimuslime~cppnjs@master');
var utilities =  cppnjs.utilities;

/**
 * Expose `iec objects`.
 */
module.exports = GenericIEC;

//seeds are required -- and are expected to be the correct neatGenome types
function GenericIEC(np, seeds, iecOptions)
{
    var self = this;

    self.options = iecOptions || {};
    self.np = np;

    //we keep track of new nodes and connections for the session
    self.newNodes = {};
    self.newConnections = {};

    //we can send in a seed genome -- to create generic objects when necessary
    self.seeds = seeds;

    for(var s=0; s < seeds.length; s++)
    {
        var seed = seeds[s];
        for(var c =0; c < seed.connections.length; c++)
        {
            var sConn = seed.connections[c];
            var cid = '(' + sConn.sourceID + ',' + sConn.targetID + ')';
            self.newConnections[cid] = sConn;
        }
    }

    self.cloneSeed = function(){

        var seedIx = utilities.next(self.seeds.length);

        var seedCopy = NeatGenome.Copy(self.seeds[seedIx]);
        if(self.options.seedMutationCount)
        {
            for(var i=0; i < self.options.seedMutationCount; i++)
                seedCopy.mutate(self.newNodes, self.newConnections, self.np);
        }
        return seedCopy;
    };

    self.markParentConnections = function(parents){

        for(var s=0; s < parents.length; s++)
        {
            var parent = parents[s];
            for(var c =0; c < parent.connections.length; c++)
            {
                var sConn = parent.connections[c];
                var cid = '(' + sConn.sourceID + ',' + sConn.targetID + ')';
                self.newConnections[cid] = sConn;
            }
        }

    };


        //this function handles creating a genotype from sent in parents.
    //it's pretty simple -- however many parents you have, select a random number of them, and attempt to mate them
    self.createNextGenome = function(parents)
    {
        self.markParentConnections(parents);
        //IF we have 0 parents, we create a genome with the default configurations
        var ng;
        var initialMutationCount = self.options.initialMutationCount || 0,
            postXOMutationCount = self.options.postMutationCount || 0;

        var responsibleParents = [];

        switch(parents.length)
        {
            case 0:

                //parents are empty -- start from scratch!
                ng = self.cloneSeed();

                for(var m=0; m < initialMutationCount; m++)
                    ng.mutate(self.newNodes, self.newConnections, self.np);

                //no responsible parents

                break;
            case 1:

                //we have one parent
                //asexual reproduction
                ng = parents[0].createOffspringAsexual(self.newNodes, self.newConnections, self.np);

                //parent at index 0 responsible
                responsibleParents.push(0);

                for(var m=0; m < postXOMutationCount; m++)
                    ng.mutate(self.newNodes, self.newConnections, self.np);

                break;
            default:
                //greater than 1 individual as a possible parent

                //at least 1 parent, and at most self.activeParents.count # of parents
                var parentCount = 1 + utilities.next(parents.length);

                if(parentCount == 1)
                {
                    //select a single parent for offspring
                    var rIx = utilities.next(parents.length);

                    ng = parents[rIx].createOffspringAsexual(self.newNodes, self.newConnections, self.np);
                    //1 responsible parent at index 0
                    responsibleParents.push(rIx);
                    break;
                }

                //we expect active parents to be small, so we grab parentCount number of parents from a small array of parents
                var parentIxs = utilities.RouletteWheel.selectXFromSmallObject(parentCount, parents);

                var p1 = parents[parentIxs[0]], p2;
                //if I have 3 parents, go in order composing the objects

                responsibleParents.push(parentIxs[0]);

                //p1 mates with p2 to create o1, o1 mates with p3, to make o2 -- p1,p2,p3 are all combined now inside of o2
                for(var i=1; i < parentIxs.length; i++)
                {
                    p2 = parents[parentIxs[i]];
                    ng = p1.createOffspringSexual(p2, self.np);
                    p1 = ng;
                    responsibleParents.push(parentIxs[i]);
                }

                for(var m=0; m < postXOMutationCount; m++)
                    ng.mutate(self.newNodes, self.newConnections, self.np);


                break;
        }

        //we have our genome, let's send it back

        //the reason we don't end it inisde the switch loop is that later, we might be interested in saving this genome from some other purpose
        return {offspring: ng, parents: responsibleParents};
    };

};


});

require.register("neatjs/evolution/multiobjective.js", function (exports, module) {
//here we have everything for NSGA-II mutliobjective search and neatjs
/**
 * Module dependencies.
 */

var NeatGenome = require('neatjs/genome/neatGenome.js');
var Novelty = require('neatjs/evolution/novelty.js');


//pull in variables from cppnjs
var cppnjs = require('optimuslime~cppnjs@master');
var utilities =  cppnjs.utilities;


/**
 * Expose `MultiobjectiveSearch`.
 */

module.exports = MultiobjectiveSearch;


//information to rank each genome
MultiobjectiveSearch.RankInfo = function()
{
    var self = this;
    //when iterating, we count how many genomes dominate other genomes
    self.dominationCount = 0;
    //who does this genome dominate
    self.dominates = [];
    //what is this genome's rank (i.e. what pareto front is it on)
    self.rank = 0;
    //has this genome been ranked
    self.ranked = false;
};
MultiobjectiveSearch.RankInfo.prototype.reset = function(){

    var self = this;
    self.rank = 0;
    self.ranked = false;
    self.dominationCount = 0;
    self.dominates = [];
};

MultiobjectiveSearch.Help = {};

MultiobjectiveSearch.Help.SortPopulation = function(pop)
{
    //sort genomes by fitness / age -- as genomes are often sorted
    pop.sort(function(x,y){

        var fitnessDelta = y.fitness - x.fitness;
        if (fitnessDelta < 0.0)
            return -1;
        else if (fitnessDelta > 0.0)
            return 1;

        var ageDelta = x.age - y.age;

        // Convert result to an int.
        if (ageDelta < 0)
            return -1;
        else if (ageDelta > 0)
            return 1;

        return 0;

    });
};

//class to assign multiobjective fitness to individuals (fitness based on what pareto front they are on)
MultiobjectiveSearch.multiobjectiveUtilities = function(np)
{

    var self = this;

    self.np = np;
    self.population = [];
    self.populationIDs = {};
    self.ranks = [];
    self.nov = new Novelty(10.0);
    self.doNovelty = false;
    self.generation = 0;

    self.localCompetition = false;

    self.measureNovelty = function()
    {
        var count = self.population.length;

        self.nov.initialize(self.population);

        //reset locality and competition for each genome
        for(var i=0; i < count; i++)
        {
            var genome = self.population[i];

            genome.locality=0.0;
            genome.competition=0.0;

            //we measure all objectives locally -- just to make it simpler
            for(var o=0; o < genome.objectives.length; o++)
                genome.localObjectivesCompetition[o] = 0.0;
        }

       var ng;
        var max = 0.0, min = 100000000000.0;

        for (var i = 0; i< count; i++)
        {
            ng = self.population[i];
            var fit = self.nov.measureNovelty(ng);

            //reset our fitness value to be local, yeah boyee
            //the first objective is fitness which is replaced with local fitness -- how many did you beat around you
            // # won / total number of neighbors = % competitive
            ng.objectives[0] = ng.competition / ng.nearestNeighbors;
            ng.objectives[ng.objectives.length - 2] = fit + 0.01;

            //the last local measure is the genome novelty measure
            var localGenomeNovelty = ng.localObjectivesCompetition[ng.objectives.length-1];

            //genomic novelty is measured locally as well
            console.log("Genomic Novelty: " + ng.objectives[ng.objectives.length - 1] + " After: " + localGenomeNovelty / ng.nearestNeighbors);

            //this makes genomic novelty into a local measure
            ng.objectives[ng.objectives.length - 1] = localGenomeNovelty / ng.nearestNeighbors;

            if(fit>max) max=fit;
            if(fit<min) min=fit;

        }

        console.log("nov min: "+ min + " max:" + max);
    };

    //if genome x dominates y, increment y's dominated count, add y to x's dominated list
    self.updateDomination = function( x,  y,  r1, r2)
    {
        if(self.dominates(x,y)) {
            r1.dominates.push(r2);
            r2.dominationCount++;
        }
    };


    //function to check whether genome x dominates genome y, usually defined as being no worse on all
    //objectives, and better at at least one
    self.dominates = function( x,  y) {
        var better=false;
        var objx = x.objectives, objy = y.objectives;

        var sz = objx.length;

        //if x is ever worse than y, it cannot dominate y
        //also check if x is better on at least one
        for(var i=0;i<sz-1;i++) {
            if(objx[i]<objy[i]) return false;
            if(objx[i]>objy[i]) better=true;
        }

        //genomic novelty check, disabled for now
        //threshold set to 0 -- Paul since genome is local
        var thresh=0.0;
        if((objx[sz-1]+thresh)<(objy[sz-1])) return false;
        if((objx[sz-1]>(objy[sz-1]+thresh))) better=true;

        return better;
    };

    //distance function between two lists of objectives, used to see if two individuals are unique
    self.distance = function(x, y) {
        var delta=0.0;
        var len = x.length;
        for(var i=0;i<len;i++) {
            var d=x[i]-y[i];
            delta+=d*d;
        }
        return delta;
    };


    //Todo: Print to file
    self.printDistribution = function()
    {
        var filename="dist"+    self.generation+".txt";
        var content="";

        console.log("Print to file disabled for now, todo: write in save to file!");
//            XmlDocument archiveout = new XmlDocument();
//            XmlPopulationWriter.WriteGenomeList(archiveout, population);
//            archiveout.Save(filename);
    };

    //currently not used, calculates genomic novelty objective for protecting innovation
    //uses a rough characterization of topology, i.e. number of connections in the genome
    self.calculateGenomicNovelty = function() {
        var sum=0.0;
        var max_conn = 0;

        var xx, yy;

        for(var g=0; g < self.population.length; g++) {
            xx = self.population[g];
            var minDist=10000000.0;

            var difference=0.0;
            var delta=0.0;
            //double array
            var distances= [];

            if(xx.connections.length > max_conn)
                max_conn = xx.connections.length;

            //int ccount=xx.ConnectionGeneList.Count;
            for(var g2=0; g2 < self.population.length; g2++) {
                yy = self.population[g2];
                if(g==g2)
                    continue;

                //measure genomic compatability using neatparams
                var d = xx.compat(yy, np);
                //if(d<minDist)
                //	minDist=d;

                distances.push(d);
            }
            //ascending order
            //want the closest individuals
            distances.Sort(function(a,b) {return a-b;});

            //grab the 10 closest distances
            var sz=Math.min(distances.length,10);

            var diversity = 0.0;

            for(var i=0;i<sz;i++)
                diversity+=distances[i];

            xx.objectives[xx.objectives.length-1] = diversity;
            sum += diversity;
        }
        console.log("Diversity: " + sum/population.length + " " + max_conn);
    };



    //add an existing population from hypersharpNEAT to the multiobjective population maintained in
    //this class, step taken before evaluating multiobjective population through the rank function
    self.addPopulation = function(genomes)
    {

        for(var i=0;i< genomes.length;i++)
        {
            var blacklist=false;

            //TODO: I'm not sure this is correct, since genomes coming in aren't measured locally yet
            //so in some sense, we're comparing local measures to global measures and seeing how far
            //if they are accidentally close, this could be bad news
//                for(var j=0;j<self.population.length; j++)
//                {
//                    if(self.distance(genomes[i].behavior.objectives, self.population[j].objectives) < 0.01)
//                        blacklist=true;  //reject a genome if it is very similar to existing genomes in pop
//                }
            //no duplicates please
            if(self.populationIDs[genomes[i].gid])
                blacklist = true;

            //TODO: Test if copies are needed, or not?
            if(!blacklist) {
                //add genome if it is unique
                //we might not need to make copies
                //this will make a copy of the behavior
//                    var copy = new neatGenome.NeatGenome.Copy(genomes[i], genomes[i].gid);
//                    self.population.push(copy);

                //push directly into population, don't use copy -- should test if this is a good idea?
                self.population.push(genomes[i]);
                self.populationIDs[genomes[i].gid] = genomes[i];

            }

        }

    };



    self.rankGenomes = function()
    {
        var size = self.population.length;

        self.calculateGenomicNovelty();
        if(self.doNovelty) {
            self.measureNovelty();
        }

        //reset rank information
        for(var i=0;i<size;i++) {
            if(self.ranks.length<i+1)
                self.ranks.push(new MultiobjectiveSearch.RankInfo());
            else
                self.ranks[i].reset();
        }
        //calculate domination by testing each genome against every other genome
        for(var i=0;i<size;i++) {
            for(var j=0;j<size;j++) {
                self.updateDomination(self.population[i], self.population[j],self.ranks[i],self.ranks[j]);
            }
        }

        //successively peel off non-dominated fronts (e.g. those genomes no longer dominated by any in
        //the remaining population)
        var front = [];
        var ranked_count=0;
        var current_rank=1;
        while(ranked_count < size) {
            //search for non-dominated front
            for(var i=0;i<size;i++)
            {
                //continue if already ranked
                if(self.ranks[i].ranked) continue;
                //if not dominated, add to front
                if(self.ranks[i].dominationCount==0) {
                    front.push(i);
                    self.ranks[i].ranked=true;
                    self.ranks[i].rank = current_rank;
                }
            }

            var front_size = front.length;
            console.log("Front " + current_rank + " size: " + front_size);

            //now take all the non-dominated individuals, see who they dominated, and decrease
            //those genomes' domination counts, because we are removing this front from consideration
            //to find the next front of individuals non-dominated by the remaining individuals in
            //the population
            for(var i=0;i<front_size;i++) {
                var r = self.ranks[front[i]];
                for (var dominated in r.dominates) {
                    dominated.dominationCount--;
                }
            }

            ranked_count+=front_size;
            front = [];
            current_rank++;
        }

        //we save the last objective for potential use as genomic novelty objective
        var last_obj = self.population[0].objectives.length-1;

        //fitness = popsize-rank (better way might be maxranks+1-rank), but doesn't matter
        //because speciation is not used and tournament selection is employed
        for(var i=0;i<size;i++) {
            self.population[i].fitness = (size+1)-self.ranks[i].rank;//+population[i].objectives[last_obj]/100000.0;
    }

        //sorting based on fitness
        MultiobjectiveSearch.Help.SortPopulation(self.population);

        self.generation++;

        if(self.generation%250==0)
            self.printDistribution();
    };

    //when we merge populations together, often the population will overflow, and we need to cut
    //it down. to do so, we just remove the last x individuals, which will be in the less significant
    //pareto fronts
    self.truncatePopulation = function(size)
    {
        var toRemove = self.population.length - size;
        console.log("population size before: " + self.population.length);
        console.log("removing " + toRemove);

        //remove the tail after sorting
        if(toRemove > 0)
            self.population.splice(size, toRemove);

        //changes to population, make sure to update our lookup
        self.populationIDs = NeatGenome.Help.CreateGIDLookup(self.population);

        console.log("population size after: " + self.population.length);

        return self.population;
    };

};

function MultiobjectiveSearch(seedGenomes, genomeEvaluationFunctions, neatParameters, searchParameters)
{
    var self=this;

    //functions for evaluating genomes in a population
    self.genomeEvaluationFunctions = genomeEvaluationFunctions;

    self.generation = 0;
    self.np = neatParameters;
    self.searchParameters = searchParameters;

    //for now, we just set seed genomes as population
    //in reality, we should use seed genomes as seeds into population determined by search parameters
    //i.e. 5 seed genomes -> 50 population size
    //TODO: Turn seed genomes into full first population
    self.population = seedGenomes;

    //create genome lookup once we have population
    self.populationIDs = NeatGenome.Help.CreateGIDLookup(seedGenomes);


    //see end of multiobjective search declaration for initailization code
    self.multiobjective= new MultiobjectiveSearch.multiobjectiveUtilities(neatParameters);
    self.np.compatibilityThreshold = 100000000.0; //disable speciation w/ multiobjective

    self.initializePopulation = function()
    {
        // The GenomeFactories normally won't bother to ensure that like connections have the same ID
        // throughout the population (because it's not very easy to do in most cases). Therefore just
        // run this routine to search for like connections and ensure they have the same ID.
        // Note. This could also be done periodically as part of the search, remember though that like
        // connections occuring within a generation are already fixed - using a more efficient scheme.
        self.matchConnectionIDs();

        // Evaluate the whole population.
        self.evaluatePopulation();

        //TODO: Add in some concept of speciation for NSGA algorithm -- other than genomic novelty?
        //We don't do speciation for NSGA-II algorithm

        // Now we have fitness scores and no speciated population we can calculate fitness stats for the
        // population as a whole -- and save best genomes
        //recall that speciation is NOT part of NSGA-II
        self.updateFitnessStats();

    };

    self.matchConnectionIDs = function()
    {
        var connectionIdTable = {};

        var genomeBound = self.population.length;
        for(var genomeIdx=0; genomeIdx<genomeBound; genomeIdx++)
        {
            var genome = self.population[genomeIdx];

            //loop through all the connections for this genome
            var connectionGeneBound = genome.connections.length;
            for(var connectionGeneIdx=0; connectionGeneIdx<connectionGeneBound; connectionGeneIdx++)
            {
                var connectionGene = genome.connections[connectionGeneIdx];

                var ces = connectionGene.sourceID + "," + connectionGene.targetID;

                var existingID = connectionIdTable[ces];

                if(existingID==null)
                {	// No connection withthe same end-points has been registered yet, so
                    // add it to the table.
                    connectionIdTable[ces] = connectionGene.gid;
                }
                else
                {	// This connection is already registered. Give our latest connection
                    // the same innovation ID as the one in the table.
                    connectionGene.gid = existingID;
                }
            }
            // The connection genes in this genome may now be out of order. Therefore we must ensure
            // they are sorted before we continue.
            genome.connections.sort(function(a,b){
               return a.gid - b.gid;
            });
        }
    };

    self.incrementAges = function()
    {
        //would normally increment species age as  well, but doesn't happen in multiobjective
        for(var i=0; i < self.population.length; i++)
        {
            var ng = self.population[i];
            ng.age++;
        }
    };
    self.updateFitnessStats = function()
    {
        self.bestFitness = Number.MIN_VALUE;
        self.bestGenome = null;
        self.totalNeuronCount = 0;
        self.totalConnectionCount = 0;
        self.totalFitness = 0;
        self.avgComplexity = 0;
        self.meanFitness =0;

        //go through the genomes, find the best genome and the most fit
        for(var i=0; i < self.population.length; i++)
        {
            var ng = self.population[i];
            if(ng.realFitness > self.bestFitness)
            {
                self.bestFitness = ng.realFitness;
                self.bestGenome = ng;
            }
            self.totalNeuronCount += ng.nodes.length;
            self.totalConnectionCount += ng.connections.length;
            self.totalFitness += ng.realFitness;
        }

        self.avgComplexity = (self.totalNeuronCount + self.totalConnectionCount)/self.population.length;
        self.meanFitness = self.totalFitness/self.population.length;

    };

    self.tournamentSelect = function(genomes)
    {
        var bestFound= 0.0;
        var bestGenome=null;
        var bound = genomes.length;

        //grab the best of 4 by default, can be more attempts than that
        for(var i=0;i<self.np.tournamentSize;i++) {
            var next= genomes[utilities.next(bound)];
            if (next.fitness > bestFound) {
                bestFound=next.fitness;
                bestGenome=next;
            }
        }

        return bestGenome;
    };


    self.evaluatePopulation= function()
    {
        //for each genome, we need to check if we should evaluate the individual, and then evaluate the individual

        //default everyone is evaluated
        var shouldEvaluate = self.genomeEvaluationFunctions.shouldEvaluateGenome || function(){return true;};
        var defaultFitness = self.genomeEvaluationFunctions.defaultFitness || 0.0001;

        if(!self.genomeEvaluationFunctions.evaluateGenome)
            throw new Error("No evaluation function defined, how are you supposed to run evolution?");

        var evaluateGenome = self.genomeEvaluationFunctions.evaluateGenome;

        for(var i=0; i < self.population.length; i++)
        {
            var ng = self.population[i];

            var fit = defaultFitness;

            if(shouldEvaluate(ng))
            {
                fit = evaluateGenome(ng, self.np);
            }

            ng.fitness = fit;
            ng.realFitness = fit;
        }

    };

    self.performOneGeneration = function()
    {
        //No speciation in multiobjective
        //therefore no species to check for removal

        //----- Stage 1. Create offspring / cull old genomes / add offspring to population.
        var regenerate = false;

        self.multiobjective.addPopulation(self.population);
        self.multiobjective.rankGenomes();


        //cut the population down to the desired size
        self.multiobjective.truncatePopulation(self.population.length);
        //no speciation necessary

        //here we can decide if we want to save to WIN

        self.updateFitnessStats();

        if(!regenerate)
        {
            self.createOffSpring();

            //we need to trim population to the elite count, then replace
            //however, this doesn't affect the multiobjective population -- just the population held in search at the time
            MultiobjectiveSearch.Help.SortPopulation(self.population);
            var eliteCount = Math.floor(self.np.elitismProportion*self.population.length);

            //remove everything but the most elite!
            self.population.splice(eliteCount, self.population.length - eliteCount);

            // Add offspring to the population.
            var genomeBound = self.offspringList.length;
            for(var genomeIdx=0; genomeIdx<genomeBound; genomeIdx++)
                self.population.push(self.offspringList[genomeIdx]);
        }

        //----- Stage 2. Evaluate genomes / Update stats.
        self.evaluatePopulation();
        self.updateFitnessStats();

        self.incrementAges();
        self.generation++;

    };


    self.createOffSpring = function()
    {
        self.offspringList = [];

        // Create a new lists so that we can track which connections/neurons have been added during this routine.
        self.newConnectionTable = [];
        self.newNodeTable = [];

        //now create chunk of offspring asexually
        self.createMultipleOffSpring_Asexual();
        //then the rest sexually
        self.createMultipleOffSpring_Sexual();
    };
    self.createMultipleOffSpring_Asexual = function()
    {
        //function for testing if offspring is valid
        var validOffspring = self.genomeEvaluationFunctions.isValidOffspring || function() {return true;};
        var attemptValid = self.genomeEvaluationFunctions.validOffspringAttempts || 5;

        var eliteCount = Math.floor(self.np.elitismProportion*self.population.length);


        //how many asexual offspring? Well, the proportion of asexual * total number of desired new individuals
        var offspringCount = Math.max(1, Math.round((self.population.length - eliteCount)*self.np.pOffspringAsexual));

        // Add offspring to a seperate genomeList. We will add the offspring later to prevent corruption of the enumeration loop.
        for(var i=0; i<offspringCount; i++)
        {
            var parent=null;

            //tournament select in multiobjective search
            parent = self.tournamentSelect(self.population);

            var offspring = parent.createOffspringAsexual(self.newNodeTable, self.newConnectionTable, self.np);
            var testCount = 0, maxTests = attemptValid;

            //if we have a valid genotype test function, it should be used for generating this individual!
            while (!validOffspring(offspring, self.np) && testCount++ < maxTests)
                offspring = parent.createOffspringAsexual(self.newNodeTable, self.newConnectionTable, self.np);

            //we have a valid offspring, send it away!
            self.offspringList.push(offspring);
        }
    };

    self.createMultipleOffSpring_Sexual = function()
    {
        //function for testing if offspring is valid
        var validOffspring = self.genomeEvaluationFunctions.isValidOffspring || function() {return true;};
        var attemptValid = self.genomeEvaluationFunctions.validOffspringAttempts || 5;

        var oneMember=false;
        var twoMembers=false;

        if(self.population.length == 1)
        {
            // We can't perform sexual reproduction. To give the species a fair chance we call the asexual routine instead.
            // This keeps the proportions of genomes per species steady.
            oneMember = true;
        }
        else if(self.population.length==2)
            twoMembers = true;

        // Determine how many sexual offspring to create.
        var eliteCount = Math.floor(self.np.elitismProportion*self.population.length);

        //how many sexual offspring? Well, the proportion of sexual * total number of desired new individuals
        var matingCount = Math.round((self.population.length - eliteCount)*self.np.pOffspringSexual);

        for(var i=0; i<matingCount; i++)
        {
            var parent1;
            var parent2=null;
            var offspring;

            if(utilities.nextDouble() < self.np.pInterspeciesMating)
            {	// Inter-species mating!
                //System.Diagnostics.Debug.WriteLine("Inter-species mating!");
                if(oneMember)
                    parent1 = self.population[0];
                else  {
                    //tournament select in multiobjective search
                    parent1 = self.tournamentSelect(self.population);
                }

                // Select the 2nd parent from the whole popualtion (there is a chance that this will be an genome
                // from this species, but that's OK).
                var j=0;
                do
                {
                    parent2  = self.tournamentSelect(self.population);
                }

                while(parent1==parent2 && j++ < 4);	// Slightly wasteful but not too bad. Limited by j.
            }
            else
            {	// Mating within the current species.
                //System.Diagnostics.Debug.WriteLine("Mating within the current species.");
                if(oneMember)
                {	// Use asexual reproduction instead.
                    offspring = self.population[0].createOffspringAsexual(self.newNodeTable, self.newConnectionTable, self.np);

                    var testCount = 0; var maxTests = attemptValid;
                    //if we have an assess function, it should be used for generating this individual!
                    while (!validOffspring(offspring) && testCount++ < maxTests)
                        offspring = self.population[0].createOffspringAsexual(self.newNodeTable, self.newConnectionTable, self.np);

                    self.offspringList.push(offspring);
                    continue;
                }

                if(twoMembers)
                {
                    offspring = self.population[0].createOffspringSexual(self.population[1], self.np);

                    var testCount = 0; var maxTests = attemptValid;

                    //if we have an assess function, it should be used for generating this individual!
                    while (!validOffspring(offspring) && testCount++ < maxTests)
                        offspring = self.population[0].createOffspringSexual(self.population[1], self.np);

                    self.offspringList.push(offspring);
                    continue;
                }

                parent1 = self.tournamentSelect(self.population);

                var j=0;
                do
                {
                    parent2 = self.tournamentSelect(self.population);
                }
                while(parent1==parent2 && j++ < 4);	// Slightly wasteful but not too bad. Limited by j.
            }

            if(parent1 != parent2)
            {
                offspring = parent1.createOffspringSexual(parent2, self.np);

                var testCount = 0; var maxTests = attemptValid;
                //if we have an assess function, it should be used for generating this individual!
                while (!validOffspring(offspring) && testCount++ < maxTests)
                    offspring = parent1.createOffspringSexual(parent2, self.np);

                self.offspringList.push(offspring);
            }
            else
            {	// No mating pair could be found. Fallback to asexual reproduction to keep the population size constant.
                offspring = parent1.createOffspringAsexual(self.newNodeTable, self.newConnectionTable,self.np);

                var testCount = 0; var maxTests = attemptValid;
                //if we have an assess function, it should be used for generating this individual!
                while (!validOffspring(offspring) && testCount++ < maxTests)
                    offspring = parent1.createOffspringAsexual(self.newNodeTable, self.newConnectionTable,self.np);

                self.offspringList.push(offspring);
            }
        }

    };



    //finishing initalizatgion of object
    self.initializePopulation();


}

});

require.register("neatjs/evolution/novelty.js", function (exports, module) {
/**
 * Module dependencies.
 */

var NeatGenome = require('neatjs/genome/neatGenome.js');
var utilities =  require('optimuslime~cppnjs@master').utilities;

/**
 * Expose `NeatNode`.
 */

module.exports = Novelty;

/**
 * Initialize a new NeatNode.
 *
 * @param {Number} threshold
 * @api public
 */
function Novelty(threshold)
{
    var self = this;

    self.nearestNeighbors = 20;
    self.initialized = false;
    self.archiveThreshold = threshold;
    self.measureAgainst = [];
    self.archive = [];
    self.pendingAddition = [];

    self.maxDistSeen = Number.MIN_VALUE;
}


Novelty.Behavior = function()
{
    var self =this;
    self.behaviorList = null;
    self.objectives = null;
};

Novelty.Behavior.BehaviorCopy = function(copyFrom)
{
    var behavior = new novelty.Behavior();
    if(copyFrom.behaviorList)
    {
        //copy the behavior over
        behavior.behaviorList = copyFrom.behaviorList.slice(0);
    }
    //if you have objectives filled out, take those too
    if(copyFrom.objectives)
    {
        behavior.objectives = copyFrom.objectives.slice(0);
    }
    //finished copying behavior
    return behavior;
};

Novelty.Behavior.distance = function(x, y)
{
    var dist = 0.0;

    if(!x.behaviorList || !y.behaviorList)
        throw new Error("One of the behaviors is empty, can't compare distance!");

    //simple calculation, loop through double array and sum up square differences
    for(var k=0;k<x.behaviorList.length;k++)
    {
        var delta = x.behaviorList[k]-y.behaviorList[k];
        dist += delta*delta;
    }

    //return square distance of behavior
    return dist;
};


Novelty.prototype.addPending = function()
{
    var self = this;

    var length = self.pendingAddition.length;

    if(length === 0)
    {
        self.archiveThreshold *= .95;
    }
    if(length > 5)
    {
        self.archiveThreshold *= 1.3;
    }

    //for all of our additions to the archive,
    //check against others to see if entered into archive
    for(var i=0; i < length; i++)
    {
        if(self.measureAgainstArchive(self.pendingAddition[i], false))
            self.archive.push(self.pendingAddition[i]);
    }

    //clear it all out
    self.pendingAddition = [];
};

Novelty.prototype.measureAgainstArchive = function(neatgenome, addToPending)
{
    var self = this;

    for(var genome in self.archive)
    {
        var dist = novelty.Behavior.distance(neatgenome.behavior, genome.behavior);

        if(dist > self.maxDistSeen)
        {
            self.maxDistSeen = dist;
            console.log('Most novel dist: ' + self.maxDistSeen);
        }

        if(dist < self.archiveThreshold)
            return false;

    }

    if(addToPending)
    {
        self.pendingAddition.push(neatgenome);
    }

    return true;
};

//measure the novelty of an organism against the fixed population
Novelty.prototype.measureNovelty = function(neatgenome)
{
    var sum = 0.0;
    var self = this;

    if(!self.initialized)
        return Number.MIN_VALUE;

    var noveltyList = [];

    for(var genome in self.measureAgainst)
    {
        noveltyList.push(
            {distance: novelty.Behavior.distance(genome, neatgenome.behavior),
            genome: genome}
        );
    }

    for(var genome in self.archive)
    {
        noveltyList.push(
            {distance: novelty.Behavior.distance(genome, neatgenome.behavior),
                genome: genome}
        );
    }

    //see if we should add this genome to the archive
    self.measureAgainstArchive(neatgenome,true);

    noveltyList.sort(function(a,b){return b.distance - a.distance});
    var nn = self.nearestNeighbors;
    if(noveltyList.length < self.nearestNeighbors) {
        nn=noveltyList.length;
    }

    neatgenome.nearestNeighbors = nn;

    //Paul - reset local competition and local genome novelty -- might have been incrementing over time
    //Not sure if that's the intention of the algorithm to keep around those scores to signify longer term success
    //this would have a biasing effect on individuals that have been around for longer
//            neatgenome.competition = 0;
//            neatgenome.localGenomeNovelty = 0;

    //TODO: Verify this is working - are local objectives set up, is this measuring properly?
    for (var x = 0; x < nn; x++)
    {
        sum += noveltyList[x].distance;

        if (neatgenome.realFitness > noveltyList[x].genome.realFitness)
            neatgenome.competition += 1;

        //compare all the objectives, and locally determine who you are beating
        for(var o =0; o < neatgenome.objectives.length; o++)
        {
            if(neatgenome.objectives[o] > noveltyList[x].genome.objectives[o])
                neatgenome.localObjectivesCompetition[o] += 1;
        }

        noveltyList[x].genome.locality += 1;
        // sum+=10000.0; //was 100
    }
    //neatgenome.locality = 0;
    //for(int x=0;x<nn;x++)
    //{
    //    sum+=noveltyList[x].First;

    //    if(neatgenome.RealFitness>noveltyList[x].Second.RealFitness)
    //        neatgenome.competition+=1;

    //    noveltyList[x].Second.locality+=1;
    //    //Paul: This might not be the correct meaning of locality, but I am hijacking it instead
    //    //count how many genomes we are neighbored to
    //    //then, if we take neatgenome.competition/neatgenome.locality - we get percentage of genomes that were beaten locally!
    //    neatgenome.locality += 1;
    //    // sum+=10000.0; //was 100
    //}
    return Math.max(sum, .0001);
}

//Todo REFINE... adding highest fitness might
//not correspond with most novel?
Novelty.prototype.add_most_novel = function(genomes)
{
    var self = this;

    var max_novelty =0;
    var best= null;

    for(var i=0;i<genomes.length;i++)
    {
        if(genomes[i].fitness > max_novelty)
        {
            best = genomes[i];
            max_novelty = genomes[i].fitness;
        }
    }
    self.archive.push(best);
};


Novelty.prototype.initialize = function(genomes)
{
    var self = this;
    self.initialized = true;

    self.measureAgainst = [];

    if(genomes !=null){
        for(var i=0;i<genomes.length;i++)
        {
            //we might not need to make copies
            //Paul: removed copies to make it easier to read the realfitness from the indiviudals, without making a million update calls
            self.measureAgainst.push(genomes[i]);//new NeatGenome.NeatGenome((NeatGenome.NeatGenome)p[i],i));
        }
    }
};

//update the measure population by intelligently sampling
//the current population + archive + fixed population
Novelty.prototype.update_measure = function(genomes)
{
    var self = this;

    var total = [];

    //we concatenate copies of the genomes, the measureagainst and archive array
    var total = genomes.slice(0).concat(self.measureAgainst.slice(0), self.archive.slice(0));

    self.mergeTogether(total, genomes.length);

    console.log("Size: " + self.measureAgainst.length);
}

Novelty.prototype.mergeTogether = function(list, size)
{
    var self = this;

    console.log("total count: "+ list.length);

//            Random r = new Random();
    var newList = [];



    //bool array
    var dirty = [];
    //doubles
    var closest = [];

    //set default values
    for(var x=0;x<list.length;x++)
    {
        dirty.push(false);
        closest.push(Number.MAX_VALUE);
    }
    //now add the first individual randomly to the new population
    var last_added = utilities.next(list.length);
    dirty[last_added] = true;
    newList.push(list[last_added]);

    while(newList.length < size)
    {
        var mostNovel = 0.0;
        var mostNovelIndex = 0;
        for(var x=0;x<list.length;x++)
        {
            if (dirty[x])
                continue;
            var dist_to_last = novelty.Behavior.distance(list[x].behavior,
            list[last_added].behavior);

            if (dist_to_last < closest[x])
                closest[x] = dist_to_last;

            if (closest[x] > mostNovel)
            {
                mostNovel = closest[x];
                mostNovelIndex = x;
            }
        }

        dirty[mostNovelIndex] = true;
        newList.push(NeatGenome.Copy(list[mostNovelIndex],0));
        last_added = mostNovelIndex;
    }

    self.measureAgainst = newList;
};

Novelty.prototype.updatePopulationFitness = function(genomes)
{
    var self = this;

    for (var i = 0; i < genomes.length; i++)
    {
        //we might not need to make copies
        self.measureAgainst[i].realFitness = genomes[i].realFitness;
    }
};

});

require.register("neatjs/genome/neatConnection.js", function (exports, module) {

/**
 * Module dependencies.
 */
//none

/**
 * Expose `NeatConnection`.
 */

module.exports = NeatConnection;

/**
 * Initialize a new NeatConnection.
 *
 * @param {String} gid
 * @param {Number} weight
 * @param {Object} srcTgtObj
 * @api public
 */

function NeatConnection(gid, weight, srcTgtObj) {

    var self = this;
    //Connection can be inferred by the cantor pair in the gid, however, in other systems, we'll need a source and target ID

    //gid must be a string
    self.gid = typeof gid === "number" ? "" + gid : gid;//(typeof gid === 'string' ? parseFloat(gid) : gid);
    self.weight = (typeof weight === 'string' ? parseFloat(weight) : weight);

    //node ids are strings now -- so make sure to save as string always
    self.sourceID = (typeof srcTgtObj.sourceID === 'number' ? "" + (srcTgtObj.sourceID) : srcTgtObj.sourceID);
    self.targetID = (typeof srcTgtObj.targetID === 'number' ? "" + (srcTgtObj.targetID) : srcTgtObj.targetID);

    //learning rates and modulatory information contained here, not generally used or tested
    self.a =0;
    self.b =0;
    self.c =0;
    self.d =0;
    self.modConnection=0;
    self.learningRate=0;

    self.isMutated=false;
}


NeatConnection.Copy = function(connection)
{
    return new NeatConnection(connection.gid, connection.weight, {sourceID: connection.sourceID, targetID: connection.targetID});
};
});

require.register("neatjs/genome/neatNode.js", function (exports, module) {
/**
 * Module dependencies.
 */
//none

/**
 * Expose `NeatNode`.
 */

module.exports = NeatNode;

/**
 * Initialize a new NeatNode.
 *
 * @param {String} gid
 * @param {Object,String} aFunc
 * @param {Number} layer
 * @param {Object} typeObj
 * @api public
 */
function NeatNode(gid, aFunc, layer, typeObj) {

    var self = this;

    //gids are strings not numbers -- make it so
    self.gid =  typeof gid === "number" ? "" + gid : gid;
    //we only story the string of the activation funciton
    //let cppns deal with actual act functions
    self.activationFunction = aFunc.functionID || aFunc;

    self.nodeType = typeObj.type;

    self.layer = (typeof layer === 'string' ? parseFloat(layer) : layer);

    //TODO: Create step tests, include in constructor
    self.step = 0;

    self.bias = 0;
}

NeatNode.INPUT_LAYER = 0.0;
NeatNode.OUTPUT_LAYER = 10.0;

NeatNode.Copy = function(otherNode)
{
    return new NeatNode(otherNode.gid, otherNode.activationFunction, otherNode.layer, {type: otherNode.nodeType});
};
});

require.register("neatjs/genome/neatGenome.js", function (exports, module) {
/**
 * Module dependencies.
 */

//pull in our cppn lib
var cppnjs = require('optimuslime~cppnjs@master');

//grab our activation factory, cppn object and connections
var CPPNactivationFactory = cppnjs.cppnActivationFactory;
var utilities = cppnjs.utilities;

//neatjs imports
var novelty = require('neatjs/evolution/novelty.js');
var NeatConnection = require('neatjs/genome/neatConnection.js');
var NeatNode = require('neatjs/genome/neatNode.js');

//help and params
var neatHelp =  require('neatjs/neatHelp/neatHelp.js');
var neatParameters =  require('neatjs/neatHelp/neatParameters.js');
var neatDecoder =  require('neatjs/neatHelp/neatDecoder.js');

var wUtils = require('optimuslime~win-utils@master');
var uuid = wUtils.cuid;

//going to need to read node types appropriately
var NodeType = require('neatjs/types/nodeType.js');

/**
 * Expose `NeatGenome`.
 */

module.exports = NeatGenome;

/**
 * Decodes a neatGenome in a cppn.
 *
 * @param {String} gid
 * @param {Array} nodes
 * @param {Array} connections
 * @param {Number} incount
 * @param {Number} outcount
 * @param {Boolean} debug
 * @api public
 */
function NeatGenome(gid, nodes, connections, incount, outcount, debug) {

    var self = this;

    self.gid = gid;
    self.fitness = 0;

    // From C#: Ensure that the connectionGenes are sorted by innovation ID at all times.
    self.nodes = nodes;
    self.connections = connections;

    //we start a fresh set of mutations for each genome we create!
    self.mutations = [];

    self.debug = debug;

    //keep track of behavior for novelty
    self.behavior = new novelty.Behavior();
    //keep track of "real" fitness - that is the objective measure we've observed
    self.realFitness = 0;
    self.age = 0;

    self.localObjectivesCompetition = [];

    self.meta = {};

    //TODO: Hash nodes, connections, and meta to make a global ID! 128-bit md5 hash?
    //WIN will assign a globalID or gid
//        self.gid = //get hash


    // From C#: For efficiency we store the number of input and output neurons. These two quantities do not change
// throughout the life of a genome. Note that inputNeuronCount does NOT include the bias neuron! use inputAndBiasNeuronCount.
// We also keep all input(including bias) neurons at the start of the neuronGeneList followed by
// the output neurons.
    self.inputNodeCount= incount;
    self.inputAndBiasNodeCount= incount+1;
    self.outputNodeCount= outcount;
    self.inputBiasOutputNodeCount= self.inputAndBiasNodeCount + self.outputNodeCount;
    self.inputBiasOutputNodeCountMinus2= self.inputBiasOutputNodeCount -2;



    self.networkAdaptable= false;
    self.networkModulatory= false;
    // Temp tables.
    self.connectionLookup = null;
    self.nodeLookup = null;

    /// From C#: A table that keeps a track of which connections have added to the sexually reproduced child genome.
    /// This is cleared on each call to CreateOffspring_Sexual() and is only declared at class level to
    /// prevent having to re-allocate the table and it's associated memory on each invokation.
//        self.newConnectionTable = null;
//        self.newNodeTable= null;
//        self.newConnectionList= null;

    self.parent = null;

}

//Define the helper functions here!
NeatGenome.Help = {};

var genomeCount = 0;

NeatGenome.Help.nextGenomeID = function()
{
    return genomeCount++;
};
NeatGenome.Help.currentGenomeID = function(){
    return genomeCount;
};
NeatGenome.Help.resetGenomeID = function(value){
    if(value ===undefined ){
        genomeCount = 0;
        return;
    }
    genomeCount = value;
};


var innovationCount = 0;
var lastID = -1;
var hitCount = 0;
//wouldn't work with multithreaded/multi-process environment
NeatGenome.Help.nextInnovationID = function(ix)
{
    if(ix !== undefined)
        return "" + ix;

    //generate random string quickly (unlikely to cause local collisions on any machine)
    //no more number based stuff -- all string now
    return uuid();
    // var id = 1000*(new Date().valueOf());//innovationCount++;
    // if(lastID === id)
    //     hitCount++;
    // else
    //     hitCount = 0;


    // lastID = id;
    // return id + (hitCount%1000);
};

// NeatGenome.Help.currentInnovationID = function(){
//     return innovationCount;
// };
// NeatGenome.Help.resetInnovationID = function(value){
//     if(value === undefined ){
//         innovationCount = 0;
//         return;
//     }

//     innovationCount = value;
// };


NeatGenome.Help.insertByInnovation = function(connection, connectionList)
{
    var self = connectionList;
    // Determine the insert idx with a linear search, starting from the end
    // since mostly we expect to be adding genes that belong only 1 or 2 genes
    // from the end at most.
    var idx= connectionList.length-1;
    for(; idx>-1; idx--)
    {
        if(uuid.isLessThan(self[idx].gid, connection.gid))
        {	// Insert idx found.
            break;
        }
    }
    connectionList.splice(idx+1, 0, connection);
};

NeatGenome.Help.CreateGIDLookup = function(arObject)
{
    var lookup = {};
    arObject.forEach(function(o)
    {
        lookup[o.gid] = o;
    });

    return lookup;

};


//NeuronGene creator
/// <summary>
/// Create a default minimal genome that describes a NN with the given number of inputs and outputs.
/// </summary>
/// <returns></returns>
//{connectionWeightRange: val, connectionProportion: val}
NeatGenome.Help.CreateGenomeByInnovation = function(ins, outs, connParams, existing)
{
    //existing is for seing if a connection innovation id already exists according to local believers/shamans
    existing = existing || {};
    //create our ins and outs,
    var inputNodeList = [], outputNodeList = [], nodeList = [], connectionList = [];

    var aFunc = CPPNactivationFactory.getActivationFunction('NullFn');

    var iCount = 0;

    // IMPORTANT NOTE: The neurons must all be created prior to any connections. That way all of the genomes
    // will obtain the same innovation ID's for the bias,input and output nodes in the initial population.
    // Create a single bias neuron.
    var node = new NeatNode(NeatGenome.Help.nextInnovationID(iCount++), aFunc, NeatNode.INPUT_LAYER, {type: NodeType.bias});
    //null, idGenerator.NextInnovationId, NeuronGene.INPUT_LAYER, NeuronType.Bias, actFunct, stepCount);
    inputNodeList.push(node);
    nodeList.push(node);


    // Create input neuron genes.
    aFunc = CPPNactivationFactory.getActivationFunction('NullFn');
    for(var i=0; i<ins; i++)
    {
        //TODO: DAVID proper activation function change to NULL?
        node = new NeatNode(NeatGenome.Help.nextInnovationID(iCount++), aFunc, NeatNode.INPUT_LAYER, {type: NodeType.input});
        inputNodeList.push(node);
        nodeList.push(node);
    }

    // Create output neuron genes.
    aFunc = CPPNactivationFactory.getActivationFunction('BipolarSigmoid');
    for(var i=0; i<outs; i++)
    {
        //TODO: DAVID proper activation function change to NULL?
        node = new NeatNode(NeatGenome.Help.nextInnovationID(iCount++), aFunc, NeatNode.OUTPUT_LAYER, {type: NodeType.output});
        outputNodeList.push(node);
        nodeList.push(node);
    }

    // Loop over all possible connections from input to output nodes and create a number of connections based upon
    // connectionProportion.
    outputNodeList.forEach(function(targetNode){

        inputNodeList.forEach(function(sourceNode){
            // Always generate an ID even if we aren't going to use it. This is necessary to ensure connections
            // between the same neurons always have the same ID throughout the generated population.

            if(utilities.nextDouble() < connParams.connectionProportion )
            {

                var cIdentifier = '(' + sourceNode.gid + "," + targetNode.gid + ')';

                // Ok lets create a connection.
                //if it already exists, we can use the existing innovation ID
                var connectionInnovationId = existing[cIdentifier] || NeatGenome.Help.nextInnovationID();

                //if we didn't have one before, we do now! If we did, we simply overwrite with the same innovation id
                existing[cIdentifier] = connectionInnovationId;

                connectionList.push(new NeatConnection(connectionInnovationId,
                    (utilities.nextDouble() * connParams.connectionWeightRange ) - connParams.connectionWeightRange/2.0,
                    {sourceID: sourceNode.gid, targetID: targetNode.gid}));

            }
        });
    });

    // Don't create any hidden nodes at this point. Fundamental to the NEAT way is to start minimally!
    return new NeatGenome(NeatGenome.Help.nextGenomeID(), nodeList, connectionList, ins, outs);
//            NeatGenome(idGenerator.NextGenomeId, neuronGeneList, connectionGeneList, inputNeuronCount, outputNeuronCount);

};


NeatGenome.Copy = function(genome, gid)
{

    var nodeCopy = [], connectionCopy = [];
    genome.nodes.forEach(function(node)
    {
        nodeCopy.push(NeatNode.Copy(node));
    });
    genome.connections.forEach(function(conn)
    {
        connectionCopy.push(NeatConnection.Copy(conn));
    });

    //not debuggin
    var gCopy = new NeatGenome((gid !== undefined ? gid : genome.gid), nodeCopy, connectionCopy, genome.inputNodeCount, genome.outputNodeCount, false);

    //copy the behavior as well -- if there exists any behavior to copy
    if(genome.behavior && (genome.behavior.objectives || genome.behavior.behaviorList))
        gCopy.behavior = novelty.Behavior.BehaviorCopy(genome.behavior);

    return gCopy;
};


/// Asexual reproduction with built in mutation.
NeatGenome.prototype.createOffspringAsexual = function(newNodeTable, newConnectionTable, np)
{
    var self = this;
    //copy the genome, then mutate
    var genome = NeatGenome.Copy(self, NeatGenome.Help.nextGenomeID());

    //mutate genome before returning
    genome.mutate(newNodeTable, newConnectionTable, np);

    return genome;
};



/// <summary>
/// Adds a connection to the list that will eventually be copied into a child of this genome during sexual reproduction.
/// A helper function that is only called by CreateOffspring_Sexual_ProcessCorrelationItem().
/// </summary>
/// <param name="connectionGene">Specifies the connection to add to this genome.</param>
/// <param name="overwriteExisting">If there is already a connection from the same source to the same target,
/// that connection is replaced when overwriteExisting is true and remains (no change is made) when overwriteExisting is false.</param>
//TODO: Use gid or innovationID?
NeatGenome.Help.createOffspringSexual_AddGene  = function(connectionList, connectionTable, connection, overwriteExisting)
{

    var conKey = connection.gid;

    // Check if a matching gene has already been added.
    var oIdx = connectionTable[conKey];

    if(oIdx==null)
    {	// No matching gene has been added.
        // Register this new gene with the newConnectionGeneTable - store its index within newConnectionGeneList.
        connectionTable[conKey] = connectionList.length;

        // Add the gene to the list.
        connectionList.push(NeatConnection.Copy(connection));
    }
    else if(overwriteExisting)
    {
        // Overwrite the existing matching gene with this one. In fact only the weight value differs between two
        // matching connection genes, so just overwrite the existing genes weight value.

        // Remember that we stored the gene's index in newConnectionGeneTable. So use it here.
        connectionList[oIdx].weight = connection.weight;
    }
};

/// <summary>
/// Given a description of a connection in two parents, decide how to copy it into their child.
/// A helper function that is only called by CreateOffspring_Sexual().
/// </summary>
/// <param name="correlationItem">Describes a connection and whether it exists on one parent, the other, or both.</param>
/// <param name="fitSwitch">If this is 1, then the first parent is more fit; if 2 then the second parent. Other values are not defined.</param>
/// <param name="combineDisjointExcessFlag">If this is true, add disjoint and excess genes to the child; otherwise, leave them out.</param>
/// <param name="np">Not used.</param>
NeatGenome.Help.createOffspringSexual_ProcessCorrelationItem
    = function(connectionList, connectionTable, correlationItem, fitSwitch, combineDisjointExcessFlag)
{
    switch(correlationItem.correlationType)
    {
        // Disjoint and excess genes.
        case neatHelp.CorrelationType.disjointConnectionGene:
        case neatHelp.CorrelationType.excessConnectionGene:
        {
            // If the gene is in the fittest parent then override any existing entry in the connectionGeneTable.
            if(fitSwitch==1 && correlationItem.connection1!=null)
            {
                NeatGenome.Help.createOffspringSexual_AddGene(connectionList, connectionTable, correlationItem.connection1, true);
                return;
            }

            if(fitSwitch==2 && correlationItem.connection2!=null)
            {
                NeatGenome.Help.createOffspringSexual_AddGene(connectionList, connectionTable, correlationItem.connection2, true);
                return;
            }

            // The disjoint/excess gene is on the less fit parent.
            //if(Utilities.NextDouble() < np.pDisjointExcessGenesRecombined)	// Include the gene n% of the time from whichever parent contains it.
            if(combineDisjointExcessFlag)
            {
                if(correlationItem.connection1!=null)
                {
                    NeatGenome.Help.createOffspringSexual_AddGene(connectionList, connectionTable, correlationItem.connection1, false);
                    return;
                }
                if(correlationItem.connection2!=null)
                {
                    NeatGenome.Help.createOffspringSexual_AddGene(connectionList, connectionTable, correlationItem.connection2, false);
                    return;
                }
            }
            break;
        }

        case neatHelp.CorrelationType.matchedConnectionGenes:
        {
            if(utilities.RouletteWheel.singleThrow(0.5))
            {
                // Override any existing entries in the table.
                NeatGenome.Help.createOffspringSexual_AddGene(connectionList, connectionTable, correlationItem.connection1, true);
            }
            else
            {
                // Override any existing entries in the table.
                NeatGenome.Help.createOffspringSexual_AddGene(connectionList, connectionTable, correlationItem.connection2, true);
            }
            break;
        }
    }
};


/// <summary>
/// Correlate the ConnectionGenes within the two ConnectionGeneLists - based upon innovation number.
/// Return an ArrayList of ConnectionGene[2] structures - pairs of matching ConnectionGenes.
/// </summary>
/// <param name="list1"></param>
/// <param name="list2"></param>
/// <returns>Resulting correlation</returns>
NeatGenome.Help.correlateConnectionListsByInnovation
    = function(list1, list2)
{
    var correlationResults = new neatHelp.CorrelationResults();

    //----- Test for special cases.
    if(!list1.length && !list2.length)
    {	// Both lists are empty!
        return correlationResults;
    }

    if(!list1.length)
    {	// All list2 genes are excess.
        correlationResults.correlationStatistics.excessConnectionCount = list2.length;

        list2.forEach(function(connection){
            //add a bunch of excess genes to our new creation!
            correlationResults.correlationList.push(new neatHelp.CorrelationItem(neatHelp.CorrelationType.excessConnectionGene, null, connection));
        });
        //done with correlating al; genes since list1 is empty
        return correlationResults;
    }

    // i believe there is a bug in the C# code, but it's completely irrelevant cause you'll never have 0 connections and for it to be sensical!
    if(!list2.length)
    {	// All list1 genes are excess.
        correlationResults.correlationStatistics.excessConnectionCount  = list1.length;

        list1.forEach(function(connection){
            //add a bunch of excess genes to our new creation!
            correlationResults.correlationList.push(new neatHelp.CorrelationItem(neatHelp.CorrelationType.excessConnectionGene, connection, null));
        });

        //done with correlating al; genes since list2 is empty
        return correlationResults;
    }

    //----- Both ConnectionGeneLists contain genes - compare the contents.
    var list1Idx=0;
    var list2Idx=0;
    var connection1 = list1[list1Idx];
    var connection2 = list2[list2Idx];

    for(;;)
    {

        if(uuid.isLessThan(connection2.gid, connection1.gid))
        {
            // connectionGene2 is disjoint.
            correlationResults.correlationList.push(new neatHelp.CorrelationItem(neatHelp.CorrelationType.disjointConnectionGene, null, connection2));
            correlationResults.correlationStatistics.disjointConnectionCount++;

            // Move to the next gene in list2.
            list2Idx++;
        }
        else if(connection1.gid == connection2.gid)
        {
            correlationResults.correlationList.push(new neatHelp.CorrelationItem(neatHelp.CorrelationType.matchedConnectionGenes, connection1, connection2));
            correlationResults.correlationStatistics.connectionWeightDelta += Math.abs(connection1.weight-connection2.weight);
            correlationResults.correlationStatistics.matchingCount++;

            // Move to the next gene in both lists.
            list1Idx++;
            list2Idx++;
        }
        else // (connectionGene2.InnovationId > connectionGene1.InnovationId)
        {
            // connectionGene1 is disjoint.
            correlationResults.correlationList.push(new  neatHelp.CorrelationItem(neatHelp.CorrelationType.disjointConnectionGene, connection1, null));
            correlationResults.correlationStatistics.disjointConnectionCount++;

            // Move to the next gene in list1.
            list1Idx++;
        }

        // Check if we have reached the end of one (or both) of the lists. If we have reached the end of both then
        // we execute the first if block - but it doesn't matter since the loop is not entered if both lists have
        // been exhausted.
        if(list1Idx >= list1.length)
        {
            // All remaining list2 genes are excess.
            for(; list2Idx<list2.length; list2Idx++)
            {
                correlationResults.correlationList.push(new neatHelp.CorrelationItem(neatHelp.CorrelationType.excessConnectionGene, null, list2[list2Idx]));
                correlationResults.correlationStatistics.excessConnectionCount++;
            }
            return correlationResults;
        }

        if(list2Idx >= list2.length)
        {
            // All remaining list1 genes are excess.
            for(; list1Idx<list1.length; list1Idx++)
            {
                correlationResults.correlationList.push(new neatHelp.CorrelationItem(neatHelp.CorrelationType.excessConnectionGene, list1[list1Idx], null));
                correlationResults.correlationStatistics.excessConnectionCount++;
            }
            return correlationResults;
        }

        connection1 = list1[list1Idx];
        connection2 = list2[list2Idx];
    }
};



//NeuronGene creator
NeatGenome.prototype.createOffspringSexual
    = function(otherParent, np)
{
    var self = this;

    if (otherParent == null || otherParent === undefined)
        return null;

    // Build a list of connections in either this genome or the other parent.
    var correlationResults = NeatGenome.Help.correlateConnectionListsByInnovation(self.connections, otherParent.connections);

    if(self.debug && !correlationResults.performIntegrityCheckByInnovation())
        throw "CorrelationResults failed innovation integrity check.";

    //----- Connection Genes.
    // We will temporarily store the offspring's genes in newConnectionGeneList and keeping track of which genes
    // exist with newConnectionGeneTable. Here we ensure these objects are created, and if they already existed
    // then ensure they are cleared. Clearing existing objects is more efficient that creating new ones because
    // allocated memory can be re-used.

    // Key = connection key, value = index in newConnectionGeneList.
    var newConnectionTable = {};

    //TODO: No 'capacity' constructor on CollectionBase. Create modified/custom CollectionBase.
    // newConnectionGeneList must be constructed on each call because it is passed to a new NeatGenome
    // at construction time and a permanent reference to the list is kept.
    var newConnectionList = [];

    // A switch that stores which parent is fittest 1 or 2. Chooses randomly if both are equal. More efficient to calculate this just once.
    var fitSwitch;
    if(self.fitness > otherParent.fitness)
        fitSwitch = 1;
    else if(self.fitness < otherParent.fitness)
        fitSwitch = 2;
    else
    {	// Select one of the parents at random to be the 'master' genome during crossover.
        if(utilities.nextDouble() < 0.5)
            fitSwitch = 1;
        else
            fitSwitch = 2;
    }

    var combineDisjointExcessFlag = utilities.nextDouble() < np.pDisjointExcessGenesRecombined;

    // Loop through the correlationResults, building a table of ConnectionGenes from the parents that will make it into our
    // new [single] offspring. We use a table keyed on connection end points to prevent passing connections to the offspring
    // that may have the same end points but a different innovation number - effectively we filter out duplicate connections.
//        var idxBound = correlationResults.correlationList.length;
    correlationResults.correlationList.forEach(function(correlationItem)
    {
        NeatGenome.Help.createOffspringSexual_ProcessCorrelationItem(newConnectionList, newConnectionTable, correlationItem, fitSwitch, combineDisjointExcessFlag);
    });



    //----- Neuron Genes.
    // Build a neuronGeneList by analysing each connection's neuron end-point IDs.
    // This strategy has the benefit of eliminating neurons that are no longer connected too.
    // Remember to always keep all input, output and bias neurons though!
    var newNodeList = [];

    // Keep a table of the NeuronGene ID's keyed by ID so that we can keep track of which ones have been added.
    // Key = innovation ID, value = null for some reason.

    var newNodeTable = {};

    // Get the input/output neurons from this parent. All Genomes share these neurons, they do not change during a run.
//        idxBound = neuronGeneList.Count;

    self.nodes.forEach(function(node)
    {
        if(node.nodeType != NodeType.hidden)
        {
            newNodeList.push(NeatNode.Copy(node));
            newNodeTable[node.gid] = node;
        }
//            else
//            {	// No more bias, input or output nodes. break the loop.
//                break;
//            }
    });

    // Now analyse the connections to determine which NeuronGenes are required in the offspring.
    // Loop through every connection in the child, and add to the child those hidden neurons that are sources or targets of the connection.
//        idxBound = newConnectionGeneList.Count;


    var nodeLookup = NeatGenome.Help.CreateGIDLookup(self.nodes);
    var otherNodeLookup = NeatGenome.Help.CreateGIDLookup(otherParent.nodes);
//        var connLookup =  NeatGenome.Help.CreateGIDLookup(self.connections);

    newConnectionList.forEach(function(connection)
    {
        var node;

        if(!newNodeTable[connection.sourceID])
        {
            //TODO: DAVID proper activation function
            // We can safely assume that any missing NeuronGenes at this point are hidden heurons.
            node = nodeLookup[connection.sourceID];
            if (node)
                newNodeList.push(NeatNode.Copy(node));
            else{
                node = otherNodeLookup[connection.sourceID];
                if(!node)
                    throw new Error("Connection references source node that does not exist in either parent: " + JSON.stringify(connection));
                
                newNodeList.push(NeatNode.Copy(otherNodeLookup[connection.sourceID]));
            }
            //newNeuronGeneList.Add(new NeuronGene(connectionGene.SourceNeuronId, NeuronType.Hidden, ActivationFunctionFactory.GetActivationFunction("SteepenedSigmoid")));
            newNodeTable[connection.sourceID] = node;
        }

        if(!newNodeTable[connection.targetID])
        {
            //TODO: DAVID proper activation function
            // We can safely assume that any missing NeuronGenes at this point are hidden heurons.
            node = nodeLookup[connection.targetID];
            if (node != null)
                newNodeList.push(NeatNode.Copy(node));
           else{
                node = otherNodeLookup[connection.targetID];
                if(!node)
                    throw new Error("Connection references target node that does not exist in either parent: " + JSON.stringify(connection));

                newNodeList.push(NeatNode.Copy(otherNodeLookup[connection.targetID]));
            }
                
            //newNeuronGeneList.Add(new NeuronGene(connectionGene.TargetNeuronId, NeuronType.Hidden, ActivationFunctionFactory.GetActivationFunction("SteepenedSigmoid")));
            newNodeTable[connection.targetID] = node;
        }
    });

    // TODO: Inefficient code?
    newNodeList.sort(function(a,b){
        var compare = uuid.isLessThan(a.gid, b.gid) ? 
            -1 : //is less than -- a- b = -1
            (a.gid == b.gid) ? 0 : //is possible equal to or greater
            1;//is greater than definitely
        return compare
    });

    // newConnectionGeneList is already sorted because it was generated by passing over the list returned by
    // CorrelateConnectionGeneLists() - which is always in order.
    return new NeatGenome(NeatGenome.Help.nextGenomeID(), newNodeList,newConnectionList, self.inputNodeCount, self.outputNodeCount, self.debug);

    //No module support in here

    // Determine which modules to pass on to the child in the same way.
    // For each module in this genome or in the other parent, if it was referenced by even one connection add it and all its dummy neurons to the child.
//        List<ModuleGene> newModuleGeneList = new List<ModuleGene>();
//
//        // Build a list of modules the child might have, which is a union of the parents' module lists, but they are all copies so we can't just do a union.
//        List<ModuleGene> unionParentModules = new List<ModuleGene>(moduleGeneList);
//        foreach (ModuleGene moduleGene in otherParent.moduleGeneList) {
//        bool alreadySeen = false;
//        foreach (ModuleGene match in unionParentModules) {
//            if (moduleGene.InnovationId == match.InnovationId) {
//                alreadySeen = true;
//                break;
//            }
//        }
//        if (!alreadySeen) {
//            unionParentModules.Add(moduleGene);
//        }
//    }

//        foreach (ModuleGene moduleGene in unionParentModules) {
//        // Examine each neuron in the child to determine whether it is part of a module.
//        foreach (List<long> dummyNeuronList in new List<long>[] { moduleGene.InputIds, moduleGene.OutputIds })
//        {
//            foreach (long dummyNeuronId in dummyNeuronList)
//            {
//                if (newNeuronGeneTable.ContainsKey(dummyNeuronId)) {
//                    goto childHasModule;
//                }
//            }
//        }
//
//        continue; // the child does not contain this module, so continue the loop and check for the next module.
//        childHasModule: // the child does contain this module, so make sure the child gets all the nodes the module requires to work.
//
//            // Make sure the child has all the neurons in the given module.
//            newModuleGeneList.Add(new ModuleGene(moduleGene));
//        foreach (List<long> dummyNeuronList in new List<long>[] { moduleGene.InputIds, moduleGene.OutputIds })
//        {
//            foreach (long dummyNeuronId in dummyNeuronList)
//            {
//                if (!newNeuronGeneTable.ContainsKey(dummyNeuronId)) {
//                    newNeuronGeneTable.Add(dummyNeuronId, null);
//                    NeuronGene neuronGene = this.neuronGeneList.GetNeuronById(dummyNeuronId);
//                    if (neuronGene != null) {
//                        newNeuronGeneList.Add(new NeuronGene(neuronGene));
//                    } else {
//                        newNeuronGeneList.Add(new NeuronGene(otherParent.NeuronGeneList.GetNeuronById(dummyNeuronId)));
//                    }
//                }
//            }
//        }
//    }



};


/// <summary>
/// Decode the genome's 'DNA' into a working network.
/// </summary>
/// <returns></returns>
NeatGenome.prototype.networkDecode = function(activationFn)
{
    var self = this;

    return neatDecoder.DecodeToFloatFastConcurrentNetwork(self, activationFn);
};


/// <summary>
/// Clone this genome.
/// </summary>
/// <returns></returns>
NeatGenome.prototype.clone = function()
{
    var self = this;
    return NeatGenome.Copy(self, NeatGenome.Help.nextGenomeID());
};

NeatGenome.prototype.compatFormer = function(comparisonGenome, np) {
    /* A very simple way of implementing this routine is to call CorrelateConnectionGeneLists and to then loop
     * through the correlation items, calculating a compatibility score as we go. However, this routine
     * is heavily used and in performance tests was shown consume 40% of the CPU time for the core NEAT code.
     * Therefore this new routine has been rewritten with it's own version of the logic within
     * CorrelateConnectionGeneLists. This allows us to only keep comparing genes up to the point where the
     * threshold is passed. This also eliminates the need to build the correlation results list, this difference
     * alone is responsible for a 200x performance improvement when testing with a 1664 length genome!!
     *
     * A further optimisation is achieved by comparing the genes starting at the end of the genomes which is
     * where most disparities are located - new novel genes are always attached to the end of genomes. This
     * has the result of complicating the routine because we must now invoke additional logic to determine
     * which genes are excess and when the first disjoint gene is found. This is done with an extra integer:
     *
     * int excessGenesSwitch=0; // indicates to the loop that it is handling the first gene.
     *						=1;	// Indicates that the first gene was excess and on genome 1.
     *						=2;	// Indicates that the first gene was excess and on genome 2.
     *						=3;	// Indicates that there are no more excess genes.
     *
     * This extra logic has a slight performance hit, but this is minor especially in comparison to the savings that
     * are expected to be achieved overall during a NEAT search.
     *
     * If you have trouble understanding this logic then it might be best to work through the previous version of
     * this routine (below) that scans through the genomes from start to end, and which is a lot simpler.
     *
     */
    var self = this;

    //this can be replaced with the following code:




    var list1 = self.connections;
    var list2 = comparisonGenome.connections;

//
//        var compatibility = 0;
//        var correlation = NeatGenome.Help.correlateConnectionListsByInnovation(list1, list2);
//        compatibility += correlation.correlationStatistics.excessConnectionCount*np.compatibilityExcessCoeff;
//        compatibility += correlation.correlationStatistics.disjointConnectionCount*np.compatibilityDisjointCoeff;
//        compatibility += correlation.correlationStatistics.connectionWeightDelta*np.compatibilityWeightDeltaCoeff;
//        return compatibility;


    var excessGenesSwitch=0;

    // Store these heavily used values locally.
    var list1Count = list1.length;
    var list2Count = list2.length;

    //----- Test for special cases.
    if(list1Count==0 && list2Count==0)
    {	// Both lists are empty! No disparities, therefore the genomes are compatible!
        return 0.0;
    }

    if(list1Count==0)
    {	// All list2 genes are excess.
        return ((list2.length * np.compatibilityExcessCoeff));
    }

    if(list2Count==0)
    {
        // All list1 genes are excess.
        return ((list1Count * np.compatibilityExcessCoeff));
    }

    //----- Both ConnectionGeneLists contain genes - compare the contents.
    var compatibility = 0.0;
    var list1Idx=list1Count-1;
    var list2Idx=list2Count-1;
    var connection1 = list1[list1Idx];
    var connection2 = list2[list2Idx];
    for(;;)
    {
        if(connection1.gid == connection2.gid)
        {
            // No more excess genes. It's quicker to set this every time than to test if is not yet 3.
            excessGenesSwitch=3;

            // Matching genes. Increase compatibility by weight difference * coeff.
            compatibility += Math.abs(connection1.weight-connection2.weight) * np.compatibilityWeightDeltaCoeff;

            // Move to the next gene in both lists.
            list1Idx--;
            list2Idx--;
        }
        else if(!uuid.isLessThan(connection2.gid, connection1.gid))
        {
            // Most common test case(s) at top for efficiency.
            if(excessGenesSwitch==3)
            {	// No more excess genes. Therefore this mismatch is disjoint.
                compatibility += np.compatibilityDisjointCoeff;
            }
            else if(excessGenesSwitch==2)
            {	// Another excess gene on genome 2.
                compatibility += np.compatibilityExcessCoeff;
            }
            else if(excessGenesSwitch==1)
            {	// We have found the first non-excess gene.
                excessGenesSwitch=3;
                compatibility += np.compatibilityDisjointCoeff;
            }
            else //if(excessGenesSwitch==0)
            {	// First gene is excess, and is on genome 2.
                excessGenesSwitch = 2;
                compatibility += np.compatibilityExcessCoeff;
            }

            // Move to the next gene in list2.
            list2Idx--;
        } 
        else // (connectionGene2.InnovationId < connectionGene1.InnovationId)
        {
            // Most common test case(s) at top for efficiency.
            if(excessGenesSwitch==3)
            {	// No more excess genes. Therefore this mismatch is disjoint.
                compatibility += np.compatibilityDisjointCoeff;
            }
            else if(excessGenesSwitch==1)
            {	// Another excess gene on genome 1.
                compatibility += np.compatibilityExcessCoeff;
            }
            else if(excessGenesSwitch==2)
            {	// We have found the first non-excess gene.
                excessGenesSwitch=3;
                compatibility += np.compatibilityDisjointCoeff;
            }
            else //if(excessGenesSwitch==0)
            {	// First gene is excess, and is on genome 1.
                excessGenesSwitch = 1;
                compatibility += np.compatibilityExcessCoeff;
            }

            // Move to the next gene in list1.
            list1Idx--;
        }


        // Check if we have reached the end of one (or both) of the lists. If we have reached the end of both then
        // we execute the first 'if' block - but it doesn't matter since the loop is not entered if both lists have
        // been exhausted.
        if(list1Idx < 0)
        {
            // All remaining list2 genes are disjoint.
            compatibility +=  (list2Idx+1) * np.compatibilityDisjointCoeff;
            return (compatibility); //< np.compatibilityThreshold);
        }

        if(list2Idx < 0)
        {
            // All remaining list1 genes are disjoint.
            compatibility += (list1Idx+1) * np.compatibilityDisjointCoeff;
            return (compatibility); //< np.compatibilityThreshold);
        }

        connection1 = list1[list1Idx];
        connection2 = list2[list2Idx];
    }
};

NeatGenome.prototype.compat = function(comparisonGenome, np) {

    var self = this;
    var list1 = self.connections;
    var list2 = comparisonGenome.connections;

    var compatibility = 0;
    var correlation = NeatGenome.Help.correlateConnectionListsByInnovation(list1, list2);
    compatibility += correlation.correlationStatistics.excessConnectionCount*np.compatibilityExcessCoeff;
    compatibility += correlation.correlationStatistics.disjointConnectionCount*np.compatibilityDisjointCoeff;
    compatibility += correlation.correlationStatistics.connectionWeightDelta*np.compatibilityWeightDeltaCoeff;
    return compatibility;

};

NeatGenome.prototype.isCompatibleWithGenome= function(comparisonGenome, np)
{
    var self = this;

    return (self.compat(comparisonGenome, np) < np.compatibilityThreshold);
};

NeatGenome.Help.InOrderInnovation = function(aObj)
{
    var prevId = 0;

    for(var i=0; i< aObj.length; i++){
        var connection = aObj[i];
        if(uuid.isLessThan(connection.gid, prevId))
            return false;
        prevId = connection.gid;
    }

    return true;
};


/// <summary>
/// For debug purposes only.
/// </summary>
/// <returns>Returns true if genome integrity checks out OK.</returns>
NeatGenome.prototype.performIntegrityCheck = function()
{
    var self = this;
    return NeatGenome.Help.InOrderInnovation(self.connections);
};


NeatGenome.prototype.mutate = function(newNodeTable, newConnectionTable, np)
{
    var self = this;

    // Determine the type of mutation to perform.
    var probabilities = [];
    probabilities.push(np.pMutateAddNode);
//        probabilities.push(0);//np.pMutateAddModule);
    probabilities.push(np.pMutateAddConnection);
    probabilities.push(np.pMutateDeleteConnection);
    probabilities.push(np.pMutateDeleteSimpleNeuron);
    probabilities.push(np.pMutateConnectionWeights);
    probabilities.push(np.pMutateChangeActivations);

    var outcome = utilities.RouletteWheel.singleThrowArray(probabilities);
    switch(outcome)
    {
        case 0:
            self.mutate_AddNode(newNodeTable);
            return 0;
        case 1:
//               self.mutate_Ad Mutate_AddModule(ea);
            self.mutate_AddConnection(newConnectionTable,np);
            return 1;
        case 2:
            self.mutate_DeleteConnection();
            return 2;
        case 3:
            self.mutate_DeleteSimpleNeuronStructure(newConnectionTable, np);
            return 3;
        case 4:
            self.mutate_ConnectionWeights(np);
            return 4;
        case 5:
            self.mutate_ChangeActivation(np);
            return 5;
    }
};



//NeuronGene creator
/// <summary>
/// Add a new node to the Genome. We do this by removing a connection at random and inserting
/// a new node and two new connections that make the same circuit as the original connection.
///
/// This way the new node is properly integrated into the network from the outset.
/// </summary>
/// <param name="ea"></param>
NeatGenome.prototype.mutate_AddNode = function(newNodeTable, connToSplit)
{
    var self = this;

    if(!self.connections.length)
        return null;

    // Select a connection at random.
    var connectionToReplaceIdx = Math.floor(utilities.nextDouble() * self.connections.length);
    var connectionToReplace =  connToSplit || self.connections[connectionToReplaceIdx];

    // Delete the existing connection. JOEL: Why delete old connection?
    //connectionGeneList.RemoveAt(connectionToReplaceIdx);

    // Check if this connection has already been split on another genome. If so then we should re-use the
    // neuron ID and two connection ID's so that matching structures within the population maintain the same ID.
    var existingNeuronGeneStruct = newNodeTable[connectionToReplace.gid];

    var newNode;
    var newConnection1;
    var newConnection2;
    var actFunct;

    var nodeLookup = NeatGenome.Help.CreateGIDLookup(self.nodes);

    //we could attempt to mutate the same node TWICE -- causing big issues, since we'll double add that node

    var acnt = 0;
    var attempts = 5;
    //while we
    while(acnt++ < attempts && existingNeuronGeneStruct && nodeLookup[existingNeuronGeneStruct.node.gid])
    {
        connectionToReplaceIdx = Math.floor(utilities.nextDouble() * self.connections.length);
        connectionToReplace =  connToSplit || self.connections[connectionToReplaceIdx];
        existingNeuronGeneStruct = newNodeTable[connectionToReplace.gid];
    }

    //we have failed to produce a new node to split!
    if(acnt == attempts && existingNeuronGeneStruct && nodeLookup[existingNeuronGeneStruct.node.gid])
        return;

    if(!existingNeuronGeneStruct)
    {	// No existing matching structure, so generate some new ID's.

        //TODO: DAVID proper random activation function
        // Replace connectionToReplace with two new connections and a neuron.
        actFunct= CPPNactivationFactory.getRandomActivationFunction();
        //newNeuronGene = new NeuronGene(ea.NextInnovationId, NeuronType.Hidden, actFunct);

        var nextID = NeatGenome.Help.nextInnovationID();//connectionToReplace.gid);

        newNode = new NeatNode(nextID, actFunct,
            (nodeLookup[connectionToReplace.sourceID].layer + nodeLookup[connectionToReplace.targetID].layer)/2.0,
            {type: NodeType.hidden});

        nextID = NeatGenome.Help.nextInnovationID();
        newConnection1 = new NeatConnection(nextID, 1.0, {sourceID: connectionToReplace.sourceID, targetID:newNode.gid});

        nextID = NeatGenome.Help.nextInnovationID();
        newConnection2 =  new NeatConnection(nextID, connectionToReplace.weight, {sourceID: newNode.gid, targetID: connectionToReplace.targetID});

        // Register the new ID's with NewNeuronGeneStructTable.
        newNodeTable[connectionToReplace.gid] = {node: newNode, connection1: newConnection1, connection2: newConnection2};
    }
    else
    {	// An existing matching structure has been found. Re-use its ID's

        //TODO: DAVID proper random activation function
        // Replace connectionToReplace with two new connections and a neuron.
        actFunct = CPPNactivationFactory.getRandomActivationFunction();
        var tmpStruct = existingNeuronGeneStruct;
        //newNeuronGene = new NeuronGene(tmpStruct.NewNeuronGene.InnovationId, NeuronType.Hidden, actFunct);
        newNode = NeatNode.Copy(tmpStruct.node);
        newNode.nodeType = NodeType.hidden;
        //new NeuronGene(null, tmpStruct.NewNeuronGene.gid, tmpStruct.NewNeuronGene.Layer, NeuronType.Hidden, actFunct, this.step);

        newConnection1 = new NeatConnection(tmpStruct.connection1.gid, 1.0, {sourceID: connectionToReplace.sourceID, targetID:newNode.gid});
//                new ConnectionGene(tmpStruct.NewConnectionGene_Input.gid, connectionToReplace.SourceNeuronId, newNeuronGene.gid, 1.0);
        newConnection2 = new NeatConnection(tmpStruct.connection2.gid, connectionToReplace.weight, {sourceID: newNode.gid, targetID: connectionToReplace.targetID});
//                new ConnectionGene(tmpStruct.NewConnectionGene_Output.gid, newNeuronGene.gid, connectionToReplace.TargetNeuronId, connectionToReplace.Weight);
    }

    // Add the new genes to the genome.
    self.nodes.push(newNode);
    NeatGenome.Help.insertByInnovation(newConnection1, self.connections);
    NeatGenome.Help.insertByInnovation(newConnection2, self.connections);

    //in javascript, we return the new node and connections created, since it's so easy!
//        return {node: newNode, connection1: newConnection1, newConnection2: newConnection2};

};

//Modules not implemented
//    NeatGenome.prototype.mutate_AddModule = function(np)
//    {
//    }

NeatGenome.prototype.testForExistingConnectionInnovation = function(sourceID, targetID)
{
    var self = this;
//        console.log('looking for source: ' + sourceID + ' target: ' + targetID);

    for(var i=0; i< self.connections.length; i++){
        var connection = self.connections[i];
        if(connection.sourceID == sourceID && connection.targetID == targetID){
            return connection;
        }
    }

    return null;
};

//messes with the activation functions
NeatGenome.prototype.mutate_ChangeActivation = function(np)
{
    //let's select a node at random (so long as it's not an input)
    var self = this;

    for(var i=0; i < self.nodes.length; i++)
    {
        //not going to change the inputs
        if(i < self.inputAndBiasNodeCount)
            continue;

        if(utilities.nextDouble() < np.pNodeMutateActivationRate)
        {
            self.nodes[i].activationFunction = CPPNactivationFactory.getRandomActivationFunction().functionID;
        }
    }
};

//add a connection, sourcetargetconnect specifies the source, target or both nodes you'd like to connect (optionally)
NeatGenome.prototype.mutate_AddConnection = function(newConnectionTable, np, sourceTargetConnect)
{
    //if we didn't send specifics, just create an empty object
    sourceTargetConnect = sourceTargetConnect || {};

    var self = this;
    // We are always guaranteed to have enough neurons to form connections - because the input/output neurons are
    // fixed. Any domain that doesn't require input/outputs is a bit nonsensical!

    // Make a fixed number of attempts at finding a suitable connection to add.

    if(self.nodes.length>1)
    {	// At least 2 neurons, so we have a chance at creating a connection.

        for(var attempts=0; attempts<5; attempts++)
        {
            // Select candidate source and target neurons. Any neuron can be used as the source. Input neurons
            // should not be used as a target
            var srcNeuronIdx;
            var tgtNeuronIdx;



            // Find all potential inputs, or quit if there are not enough.
            // Neurons cannot be inputs if they are dummy input nodes of a module.
            var potentialInputs = [];

            self.nodes.forEach(function(n)
            {
                if(n.activationFunction.functionID !== 'ModuleInputNeuron')
                    potentialInputs.push(n);
            });


            if (potentialInputs.length < 1)
                return false;

            var potentialOutputs = [];

            // Find all potential outputs, or quit if there are not enough.
            // Neurons cannot be outputs if they are dummy input or output nodes of a module, or network input or bias nodes.
            self.nodes.forEach(function(n)
            {
                if(n.nodeType != NodeType.bias && n.nodeType != NodeType.input &&
                    n.activationFunction.functionID !== 'ModuleInputNeuron'
                    &&  n.activationFunction.functionID !== 'ModuleOutputNeuron')
                    potentialOutputs.push(n);
            });

            if (potentialOutputs.length < 1)
                return false;

            var sourceNeuron = sourceTargetConnect.source || potentialInputs[utilities.next(potentialInputs.length)];
            var targetNeuron = sourceTargetConnect.target || potentialOutputs[utilities.next(potentialOutputs.length)];

            // Check if a connection already exists between these two neurons.
            var sourceID = sourceNeuron.gid;
            var targetID = targetNeuron.gid;

            //we don't allow recurrent connections, we can't let the target layers be <= src
            if(np.disallowRecurrence && targetNeuron.layer <= sourceNeuron.layer)
                continue;

            if(!self.testForExistingConnectionInnovation(sourceID, targetID))
            {
                // Check if a matching mutation has already occured on another genome.
                // If so then re-use the connection ID.
                var connectionKey = "(" + sourceID + "," + targetID + ")";
                var existingConnection = newConnectionTable[connectionKey];
                var newConnection;
                var nextID = NeatGenome.Help.nextInnovationID();
                if(existingConnection==null)
                {	// Create a new connection with a new ID and add it to the Genome.
                    newConnection = new NeatConnection(nextID,
                        (utilities.nextDouble()*np.connectionWeightRange/4.0) - np.connectionWeightRange/8.0,
                        {sourceID: sourceID, targetID: targetID});

//                            new ConnectionGene(ea.NextInnovationId, sourceID, targetID,
//                            (Utilities.NextDouble() * ea.NeatParameters.connectionWeightRange/4.0) - ea.NeatParameters.connectionWeightRange/8.0);

                    // Register the new connection with NewConnectionGeneTable.
                    newConnectionTable[connectionKey] = newConnection;

                    // Add the new gene to this genome. We have a new ID so we can safely append the gene to the end
                    // of the list without risk of breaking the innovation ID order.
                    self.connections.push(newConnection);
                }
                else
                {	// Create a new connection, re-using the ID from existingConnection, and add it to the Genome.
                    newConnection = new NeatConnection(existingConnection.gid,
                        (utilities.nextDouble()*np.connectionWeightRange/4.0) -  np.connectionWeightRange/8.0,
                        {sourceID: sourceID, targetID: targetID});

//                            new ConnectionGene(existingConnection.InnovationId, sourceId, targetID,
//                            (Utilities.NextDouble() * ea.NeatParameters.connectionWeightRange/4.0) - ea.NeatParameters.connectionWeightRange/8.0);

                    // Add the new gene to this genome. We are re-using an ID so we must ensure the connection gene is
                    // inserted into the correct position (sorted by innovation ID).
                    NeatGenome.Help.insertByInnovation(newConnection, self.connections);
//                        connectionGeneList.InsertIntoPosition(newConnection);
                }



                return true;
            }
        }
    }

    // We couldn't find a valid connection to create. Instead of doing nothing lets perform connection
    // weight mutation.
    self.mutate_ConnectionWeights(np);

    return false;
};

NeatGenome.prototype.mutate_ConnectionWeights = function(np)
{
    var self = this;
    // Determine the type of weight mutation to perform.
    var probabilties = [];

    np.connectionMutationParameterGroupList.forEach(function(connMut){
        probabilties.push(connMut.activationProportion);
    });

    // Get a reference to the group we will be using.
    var paramGroup = np.connectionMutationParameterGroupList[utilities.RouletteWheel.singleThrowArray(probabilties)];

    // Perform mutations of the required type.
    if(paramGroup.selectionType== neatParameters.ConnectionSelectionType.proportional)
    {
        var mutationOccured=false;
        var connectionCount = self.connections.length;
        self.connections.forEach(function(connection){

            if(utilities.nextDouble() < paramGroup.proportion)
            {
                self.mutateConnectionWeight(connection, np, paramGroup);
                mutationOccured = true;
            }

        });

        if(!mutationOccured && connectionCount>0)
        {	// Perform at least one mutation. Pick a gene at random.
            self.mutateConnectionWeight(self.connections[utilities.next(connectionCount)], // (Utilities.NextDouble() * connectionCount)],
                np,
                paramGroup);
        }
    }
    else // if(paramGroup.SelectionType==ConnectionSelectionType.FixedQuantity)
    {
        // Determine how many mutations to perform. At least one - if there are any genes.
        var connectionCount = self.connections.length;

        var mutations = Math.min(connectionCount, Math.max(1, paramGroup.quantity));
        if(mutations==0) return;

        // The mutation loop. Here we pick an index at random and scan forward from that point
        // for the first non-mutated gene. This prevents any gene from being mutated more than once without
        // too much overhead. In fact it's optimal for small numbers of mutations where clashes are unlikely
        // to occur.
        for(var i=0; i<mutations; i++)
        {
            // Pick an index at random.
            var index = utilities.next(connectionCount);
            var connection = self.connections[index];

            // Scan forward and find the first non-mutated gene.
            while(self.connections[index].isMutated)
            {	// Increment index. Wrap around back to the start if we go off the end.
                if(++index==connectionCount)
                    index=0;
            }

            // Mutate the gene at 'index'.
            self.mutateConnectionWeight(self.connections[index], np, paramGroup);
            self.connections[index].isMutated = true;
        }

        self.connections.forEach(function(connection){
            //reset if connection has been mutated, in case we go to do more mutations...
            connection.isMutated = false;
        });

    }
};

NeatGenome.prototype.mutateConnectionWeight = function(connection, np, paramGroup)
{
    switch(paramGroup.perturbationType)
    {
        case neatParameters.ConnectionPerturbationType.jiggleEven:
        {
            connection.weight += (utilities.nextDouble()*2-1.0) * paramGroup.perturbationFactor;

            // Cap the connection weight. Large connections weights reduce the effectiveness of the search.
            connection.weight = Math.max(connection.weight, -np.connectionWeightRange/2.0);
            connection.weight = Math.min(connection.weight, np.connectionWeightRange/2.0);
            break;
        }
        //Paul - not implementing cause Randlib.gennor is a terribel terrible function
        //if i need normal distribution, i'll find another javascript source
//            case neatParameters.ConnectionPerturbationType.jiggleND:
//            {
//                connectionGene.weight += RandLib.gennor(0, paramGroup.Sigma);
//
//                // Cap the connection weight. Large connections weights reduce the effectiveness of the search.
//                connectionGene.weight = Math.max(connectionGene.weight, -np.connectionWeightRange/2.0);
//                connectionGene.weight = Math.min(connectionGene.weight, np.connectionWeightRange/2.0);
//                break;
//            }
        case neatParameters.ConnectionPerturbationType.reset:
        {
            // TODO: Precalculate connectionWeightRange / 2.
            connection.weight = (utilities.nextDouble()*np.connectionWeightRange) - np.connectionWeightRange/2.0;
            break;
        }
        default:
        {
            throw "Unexpected ConnectionPerturbationType";
        }
    }
};

/// <summary>
/// If the neuron is a hidden neuron and no connections connect to it then it is redundant.
/// No neuron is redundant that is part of a module (although the module itself might be found redundant separately).
/// </summary>
NeatGenome.prototype.isNeuronRedundant=function(nodeLookup, nid)
{
    var self = this;
    var node = nodeLookup[nid];
    if (node.nodeType != NodeType.hidden
        || node.activationFunction.functionID === 'ModuleInputNeuron'
        || node.activationFunction.functionID === 'ModuleOutputNeuron')
        return false;

    return !self.isNeuronConnected(nid);
};

NeatGenome.prototype.isNeuronConnected = function(nid)
{
    var self = this;
    for(var i=0; i < self.connections.length; i++)
    {
        var connection =  self.connections[i];

        if(connection.sourceID == nid)
            return true;
        if(connection.targetID == nid)
            return true;

    }

    return false;
};


NeatGenome.prototype.mutate_DeleteConnection = function(connection)
{
    var self = this;
    if(self.connections.length ==0)
        return;

    self.nodeLookup = NeatGenome.Help.CreateGIDLookup(self.nodes);

    // Select a connection at random.
    var connectionToDeleteIdx = utilities.next(self.connections.length);

    if(connection){
        for(var i=0; i< self.connections.length; i++){
            if(connection.gid == self.connections[i].gid)
            {
                connectionToDeleteIdx = i;
                break;
            }
        }
    }

    var connectionToDelete = connection || self.connections[connectionToDeleteIdx];

    // Delete the connection.
    self.connections.splice(connectionToDeleteIdx,1);

    var srcIx = -1;
    var tgtIx = -1;

    self.nodes.forEach(function(node,i){

        if(node.sourceID == connectionToDelete.sourceID)
            srcIx = i;

        if(node.targetID == connectionToDelete.targetID)
            tgtIx = i;
    });

    // Remove any neurons that may have been left floating.
    if(self.isNeuronRedundant(self.nodeLookup ,connectionToDelete.sourceID)){
        self.nodes.splice(srcIx,1);//(connectionToDelete.sourceID);
    }

    // Recurrent connection has both end points at the same neuron!
    if(connectionToDelete.sourceID !=connectionToDelete.targetID){
        if(self.isNeuronRedundant(self.nodeLookup, connectionToDelete.targetID))
            self.nodes.splice(tgtIx,1);//neuronGeneList.Remove(connectionToDelete.targetID);
    }
};

NeatGenome.BuildNeuronConnectionLookupTable_NewConnection = function(nodeConnectionLookup,nodeTable, gid, connection, inOrOut)
{
    // Is this neuron already known to the lookup table?
    var lookup = nodeConnectionLookup[gid];

    if(lookup==null)
    {	// Creae a new lookup entry for this neuron Id.
        lookup = {node: nodeTable[gid], incoming: [], outgoing: [] };
        nodeConnectionLookup[gid] = lookup;
    }

    // Register the connection with the NeuronConnectionLookup object.
    lookup[inOrOut].push(connection);
};
NeatGenome.prototype.buildNeuronConnectionLookupTable = function()
{
    var self = this;
    self.nodeLookup = NeatGenome.Help.CreateGIDLookup(self.nodes);

    var nodeConnectionLookup = {};

    self.connections.forEach(function(connection){

        //what node is this connections target? That makes this an incoming connection
        NeatGenome.BuildNeuronConnectionLookupTable_NewConnection(nodeConnectionLookup,
            self.nodeLookup,connection.targetID, connection, 'incoming');

        //what node is this connectino's source? That makes this an outgoing connection for the node
        NeatGenome.BuildNeuronConnectionLookupTable_NewConnection(nodeConnectionLookup,
            self.nodeLookup, connection.sourceID, connection, 'outgoing');
    });

    return nodeConnectionLookup;
};

/// <summary>
/// We define a simple neuron structure as a neuron that has a single outgoing or single incoming connection.
/// With such a structure we can easily eliminate the neuron and shift it's connections to an adjacent neuron.
/// If the neuron's non-linearity was not being used then such a mutation is a simplification of the network
/// structure that shouldn't adversly affect its functionality.
/// </summary>
NeatGenome.prototype.mutate_DeleteSimpleNeuronStructure = function(newConnectionTable, np)
{

    var self = this;

    // We will use the NeuronConnectionLookupTable to find the simple structures.
    var nodeConnectionLookup = self.buildNeuronConnectionLookupTable();


    // Build a list of candidate simple neurons to choose from.
    var simpleNeuronIdList = [];

    for(var lookupKey in nodeConnectionLookup)
    {
        var lookup = nodeConnectionLookup[lookupKey];


        // If we test the connection count with <=1 then we also pick up neurons that are in dead-end circuits,
        // RemoveSimpleNeuron is then able to delete these neurons from the network structure along with any
        // associated connections.
        // All neurons that are part of a module would appear to be dead-ended, but skip removing them anyway.
        if (lookup.node.nodeType == NodeType.hidden
            && !(lookup.node.activationFunction.functionID == 'ModuleInputNeuron')
            && !(lookup.node.activationFunction.functionID == 'ModuleOutputNeuron') ) {
            if((lookup.incoming.length<=1) || (lookup.outgoing.length<=1))
                simpleNeuronIdList.push(lookup.node.gid);
        }
    }

    // Are there any candiate simple neurons?
    if(simpleNeuronIdList.length==0)
    {	// No candidate neurons. As a fallback lets delete a connection.
        self.mutate_DeleteConnection();
        return false;
    }

    // Pick a simple neuron at random.
    var idx = utilities.next(simpleNeuronIdList.length);//Math.floor(utilities.nextDouble() * simpleNeuronIdList.length);
    var nid = simpleNeuronIdList[idx];
    self.removeSimpleNeuron(nodeConnectionLookup, nid, newConnectionTable, np);

    return true;
};

NeatGenome.prototype.removeSimpleNeuron = function(nodeConnectionLookup, nid, newConnectionTable, np)
{
    var self = this;
    // Create new connections that connect all of the incoming and outgoing neurons
    // that currently exist for the simple neuron.
    var lookup = nodeConnectionLookup[nid];

    lookup.incoming.forEach(function(incomingConnection)
    {
        lookup.outgoing.forEach(function(outgoingConnection){

            if(!self.testForExistingConnectionInnovation(incomingConnection.sourceID, outgoingConnection.targetID))
            {	// Connection doesnt already exists.

                // Test for matching connection within NewConnectionGeneTable.
                var connectionKey =  "(" + incomingConnection.sourceID + "," + outgoingConnection.targetID + ")";

                //new ConnectionEndpointsStruct(incomingConnection.SourceNeuronId,
//                   outgoi//ngConnection.TargetNeuronId);
                var existingConnection = newConnectionTable[connectionKey];
                var newConnection;
                var nextID = NeatGenome.Help.nextInnovationID();
                if(existingConnection==null)
                {	// No matching connection found. Create a connection with a new ID.
                    newConnection = new NeatConnection(nextID,
                        (utilities.nextDouble() * np.connectionWeightRange) - np.connectionWeightRange/2.0,
                        {sourceID:incomingConnection.sourceID, targetID: outgoingConnection.targetID});
//                           new ConnectionGene(ea.NextInnovationId,
//                           incomingConnection.SourceNeuronId,
//                           outgoingConnection.TargetNeuronId,
//                           (Utilities.NextDouble() * ea.NeatParameters.connectionWeightRange) - ea.NeatParameters.connectionWeightRange/2.0);

                    // Register the new ID with NewConnectionGeneTable.
                    newConnectionTable[connectionKey] = newConnection;

                    // Add the new gene to the genome.
                    self.connections.push(newConnection);
                }
                else
                {	// Matching connection found. Re-use its ID.
                    newConnection = new NeatConnection(existingConnection.gid,
                        (utilities.nextDouble() * np.connectionWeightRange) - np.connectionWeightRange/2.0,
                        {sourceID:incomingConnection.sourceID, targetID: outgoingConnection.targetID});

                    // Add the new gene to the genome. Use InsertIntoPosition() to ensure we don't break the sort
                    // order of the connection genes.
                    NeatGenome.Help.insertByInnovation(newConnection, self.connections);
                }

            }

        });

    });


    lookup.incoming.forEach(function(incomingConnection, inIx)
    {
        for(var i=0; i < self.connections.length; i++)
        {
            if(self.connections[i].gid == incomingConnection.gid)
            {
                self.connections.splice(i,1);
                break;
            }
        }
    });

    lookup.outgoing.forEach(function(outgoingConnection, inIx)
    {
        if(outgoingConnection.targetID != nid)
        {
            for(var i=0; i < self.connections.length; i++)
            {
                if(self.connections[i].gid == outgoingConnection.gid)
                {
                    self.connections.splice(i,1);
                    break;
                }
            }
        }
    });

    // Delete the simple neuron - it no longer has any connections to or from it.
    for(var i=0; i < self.nodes.length; i++)
    {
        if(self.nodes[i].gid == nid)
        {
            self.nodes.splice(i,1);
            break;
        }
    }


};

});

require.register("neatjs/neatHelp/neatDecoder.js", function (exports, module) {
/**
 * Module dependencies.
 */

//pull in our cppn lib
var cppnjs = require('optimuslime~cppnjs@master');

//grab our activation factory, cppn object and connections
var CPPNactivationFactory = cppnjs.cppnActivationFactory;
var CPPN = cppnjs.cppn;
var CPPNConnection = cppnjs.cppnConnection;

//going to need to read node types appropriately
var NodeType = require('neatjs/types/nodeType.js');

/**
 * Expose `NeatDecoder`.
 */

var neatDecoder = {};

module.exports = neatDecoder;

/**
 * Decodes a neatGenome in a cppn.
 *
 * @param {Object} ng
 * @param {String} activationFunction
 * @api public
 */
neatDecoder.DecodeToFloatFastConcurrentNetwork = function(ng, activationFunction)
{
    var outputNeuronCount = ng.outputNodeCount;
    var neuronGeneCount = ng.nodes.length;

    var biasList = [];
    for(var b=0; b< neuronGeneCount; b++)
        biasList.push(0);

    // Slightly inefficient - determine the number of bias nodes. Fortunately there is not actually
    // any reason to ever have more than one bias node - although there may be 0.

    var activationFunctionArray = [];
    for(var i=0; i < neuronGeneCount; i++){
        activationFunctionArray.push("");
    }

    var nodeIdx=0;
    for(; nodeIdx<neuronGeneCount; nodeIdx++)
    {
        activationFunctionArray[nodeIdx] = CPPNactivationFactory.getActivationFunction(ng.nodes[nodeIdx].activationFunction);
        if(ng.nodes[nodeIdx].nodeType !=  NodeType.bias)
            break;
    }
    var biasNodeCount = nodeIdx;
    var inputNeuronCount = ng.inputNodeCount;
    for (; nodeIdx < neuronGeneCount; nodeIdx++)
    {
        activationFunctionArray[nodeIdx] = CPPNactivationFactory.getActivationFunction(ng.nodes[nodeIdx].activationFunction);
        biasList[nodeIdx] = ng.nodes[nodeIdx].bias;
    }

    // ConnectionGenes point to a neuron ID. We need to map this ID to a 0 based index for
    // efficiency.

    // Use a quick heuristic to determine which will be the fastest technique for mapping the connection end points
    // to neuron indexes. This is heuristic is not 100% perfect but has been found to be very good in in real word
    // tests. Feel free to perform your own calculation and create a more intelligent heuristic!
    var  connectionCount= ng.connections.length;

    var fastConnectionArray = [];
    for(var i=0; i< connectionCount; i++){
        fastConnectionArray.push(new CPPNConnection(0,0,0));
    }

    var nodeTable = {};// neuronIndexTable = new Hashtable(neuronGeneCount);
    for(var i=0; i<neuronGeneCount; i++)
        nodeTable[ng.nodes[i].gid] = i;

    for(var connectionIdx=0; connectionIdx<connectionCount; connectionIdx++)
    {
        //fastConnectionArray[connectionIdx] = new FloatFastConnection();
        //Note. Binary search algorithm assume that neurons are ordered by their innovation Id.
        var connection = ng.connections[connectionIdx];
        fastConnectionArray[connectionIdx].sourceIdx = nodeTable[connection.sourceID];
        fastConnectionArray[connectionIdx].targetIdx = nodeTable[connection.targetID];

        //save this for testing!
//                System.Diagnostics.Debug.Assert(fastConnectionArray[connectionIdx].sourceNeuronIdx>=0 && fastConnectionArray[connectionIdx].targetNeuronIdx>=0, "invalid idx");

        fastConnectionArray[connectionIdx].weight = connection.weight;
        fastConnectionArray[connectionIdx].learningRate = connection.learningRate;
        fastConnectionArray[connectionIdx].a = connection.a;
        fastConnectionArray[connectionIdx].b = connection.b;
        fastConnectionArray[connectionIdx].c = connection.c;

//                connectionIdx++;
    }

    // Now sort the connection array on sourceNeuronIdx, secondary sort on targetNeuronIdx.
    // Using Array.Sort is 10 times slower than the hand-coded sorting routine. See notes on that routine for more
    // information. Also note that in tests that this sorting did no t actually improve the speed of the network!
    // However, it may have a benefit for CPUs with small caches or when networks are very large, and since the new
    // sort takes up hardly any time for even large networks, it seems reasonable to leave in the sort.
    //Array.Sort(fastConnectionArray, fastConnectionComparer);
    //if(fastConnectionArray.Length>1)
    //	QuickSortFastConnections(0, fastConnectionArray.Length-1);

    return new CPPN(biasNodeCount, inputNeuronCount,
        outputNeuronCount, neuronGeneCount,
        fastConnectionArray, biasList, activationFunctionArray);

};


});

require.register("neatjs/neatHelp/neatHelp.js", function (exports, module) {
/**
* Module dependencies.
*/
var uuid = require('optimuslime~win-utils@master').cuid;
/**
* Expose `neatHelp`.
*/

var neatHelp = {};

module.exports = neatHelp;

//define helper types!
neatHelp.CorrelationType =
{
    matchedConnectionGenes : 0,
    disjointConnectionGene : 1,
    excessConnectionGene : 2
};

neatHelp.CorrelationStatistics = function(){

    var self= this;
    self.matchingCount = 0;
    self.disjointConnectionCount = 0;
    self.excessConnectionCount = 0;
    self.connectionWeightDelta = 0;
};

neatHelp.CorrelationItem = function(correlationType, conn1, conn2)
{
    var self= this;
    self.correlationType = correlationType;
    self.connection1 = conn1;
    self.connection2 = conn2;
};


neatHelp.CorrelationResults = function()
{
    var self = this;

    self.correlationStatistics = new neatHelp.CorrelationStatistics();
    self.correlationList = [];

};

//TODO: Integrity check by GlobalID
neatHelp.CorrelationResults.prototype.performIntegrityCheckByInnovation = function()
{
    var prevInnovationId= "";

    var self = this;

    for(var i=0; i< self.correlationList.length; i++){
        var correlationItem =  self.correlationList[i];

        switch(correlationItem.correlationType)
        {
            // Disjoint and excess genes.
            case neatHelp.CorrelationType.disjointConnectionGene:
            case neatHelp.CorrelationType.excessConnectionGene:
                // Disjoint or excess gene.
                if(		(!correlationItem.connection1 && !correlationItem.connection2)
                    ||	(correlationItem.connection1 && correlationItem.connection2))
                {	// Precisely one gene should be present.
                    return false;
                }
                if(correlationItem.connection1)
                {
                    if(uuid.isLessThan(correlationItem.connection1.gid, prevInnovationId) || correlationItem.connection1.gid == prevInnovationId)
                        return false;

                    prevInnovationId = correlationItem.connection1.gid;
                }
                else // ConnectionGene2 is present.
                {
                    if(uuid.isLessThan(correlationItem.connection2.gid, prevInnovationId) || correlationItem.connection2.gid == prevInnovationId)
                        return false;

                    prevInnovationId = correlationItem.connection2.gid;
                }

                break;
            case neatHelp.CorrelationType.matchedConnectionGenes:

                if(!correlationItem.connection1 || !correlationItem.connection2)
                    return false;

                if(		(correlationItem.connection1.gid != correlationItem.connection2.gid)
                    ||	(correlationItem.connection1.sourceID != correlationItem.connection2.sourceID)
                    ||	(correlationItem.connection1.targetID != correlationItem.connection2.targetID))
                    return false;

                // Innovation ID's should be in order and not duplicated.
                if(uuid.isLessThan(correlationItem.connection1.gid, prevInnovationId) || correlationItem.connection1.gid == prevInnovationId)
                    return false;

                prevInnovationId = correlationItem.connection1.gid;

                break;
        }
    }

    return true;
};

});

require.register("neatjs/neatHelp/neatParameters.js", function (exports, module) {
/**
 * Module dependencies.
 */
//none

/**
 * Expose `neatParameters`.
 */
module.exports = NeatParameters;

var	DEFAULT_POPULATION_SIZE = 150;
var  DEFAULT_P_INITIAL_POPULATION_INTERCONNECTIONS = 1.00;//DAVID 0.05F;

var DEFAULT_P_OFFSPRING_ASEXUAL = 0.5;
var DEFAULT_P_OFFSPRING_SEXUAL = 0.5;
var DEFAULT_P_INTERSPECIES_MATING = 0.01;

var DEFAULT_P_DISJOINGEXCESSGENES_RECOMBINED = 0.1;

//----- High level mutation proportions
var DEFAULT_P_MUTATE_CONNECTION_WEIGHTS = 0.988;
var DEFAULT_P_MUTATE_ADD_NODE = 0.002;
var DEFAULT_P_MUTATE_ADD_MODULE = 0.0;
var DEFAULT_P_MUTATE_ADD_CONNECTION = 0.018;
var DEFAULT_P_MUTATE_CHANGE_ACTIVATIONS = 0.001;
var DEFAULT_P_MUTATE_DELETE_CONNECTION = 0.001;
var DEFAULT_P_MUTATE_DELETE_SIMPLENEURON = 0.00;
var DEFAULT_N_MUTATE_ACTIVATION = 0.01;

//-----
var DEFAULT_COMPATIBILITY_THRESHOLD = 8 ;
var DEFAULT_COMPATIBILITY_DISJOINT_COEFF = 1.0;
var DEFAULT_COMPATIBILITY_EXCESS_COEFF = 1.0;
var DEFAULT_COMPATIBILITY_WEIGHTDELTA_COEFF = 0.05;

var DEFAULT_ELITISM_PROPORTION = 0.2;
var DEFAULT_SELECTION_PROPORTION = 0.2;

var DEFAULT_TARGET_SPECIES_COUNT_MIN = 6;
var DEFAULT_TARGET_SPECIES_COUNT_MAX = 10;

var DEFAULT_SPECIES_DROPOFF_AGE = 200;

var DEFAULT_PRUNINGPHASE_BEGIN_COMPLEXITY_THRESHOLD = 50;
var DEFAULT_PRUNINGPHASE_BEGIN_FITNESS_STAGNATION_THRESHOLD = 10;
var DEFAULT_PRUNINGPHASE_END_COMPLEXITY_STAGNATION_THRESHOLD = 15;

var DEFAULT_CONNECTION_WEIGHT_RANGE = 10.0;
//		public const double DEFAULT_CONNECTION_MUTATION_SIGMA = 0.015;

var DEFAULT_ACTIVATION_PROBABILITY = 1.0;

NeatParameters.ConnectionPerturbationType =
{
    /// <summary>
    /// Reset weights.
    /// </summary>
    reset : 0,

        /// <summary>
        /// Jiggle - even distribution
        /// </summary>
        jiggleEven :1

        /// <summary>
        /// Jiggle - normal distribution
        /// </summary>
//            jiggleND : 2
};
NeatParameters.ConnectionSelectionType =
{
    /// <summary>
    /// Select a proportion of the weights in a genome.
    /// </summary>
    proportional :0,

        /// <summary>
        /// Select a fixed number of weights in a genome.
        /// </summary>
        fixedQuantity :1
};

NeatParameters.ConnectionMutationParameterGroup = function(
     activationProportion,
     perturbationType,
     selectionType,
     proportion,
     quantity,
     perturbationFactor,
     sigma)
{
    var self = this;
    /// <summary>
    /// This group's activation proportion - relative to the totalled
    /// ActivationProportion for all groups.
    /// </summary>
    self.activationProportion = activationProportion;

    /// <summary>
    /// The type of mutation that this group represents.
    /// </summary>
    self.perturbationType = perturbationType;

    /// <summary>
    /// The type of connection selection that this group represents.
    /// </summary>
    self.selectionType = selectionType;

    /// <summary>
    /// Specifies the proportion for SelectionType.Proportional
    /// </summary>
    self.proportion=proportion ;

    /// <summary>
    /// Specifies the quantity for SelectionType.FixedQuantity
    /// </summary>
    self.quantity= quantity;

    /// <summary>
    /// The perturbation factor for ConnectionPerturbationType.JiggleEven.
    /// </summary>
    self.perturbationFactor= perturbationFactor;

    /// <summary>
    /// Sigma for for ConnectionPerturbationType.JiggleND.
    /// </summary>
    self.sigma= sigma;
};

NeatParameters.ConnectionMutationParameterGroup.Copy = function(copyFrom)
{
    return new NeatParameters.ConnectionMutationParameterGroup(
        copyFrom.ActivationProportion,
         copyFrom.PerturbationType,
           copyFrom.SelectionType,
         copyFrom.Proportion,
      copyFrom.Quantity,
       copyFrom.PerturbationFactor,
     copyFrom.Sigma
    );
};

function NeatParameters()
{
    var self = this;
    self.histogramBins = [];
    self.archiveThreshold=3.00;
    self.tournamentSize=4;
    self.noveltySearch=false;
    self.noveltyHistogram=false;
    self.noveltyFixed=false;
    self.noveltyFloat=false;
    self.multiobjective=false;

    self.allowSelfConnections = false;

    self.populationSize = DEFAULT_POPULATION_SIZE;
    self.pInitialPopulationInterconnections = DEFAULT_P_INITIAL_POPULATION_INTERCONNECTIONS;

    self.pOffspringAsexual = DEFAULT_P_OFFSPRING_ASEXUAL;
    self.pOffspringSexual = DEFAULT_P_OFFSPRING_SEXUAL;
    self.pInterspeciesMating = DEFAULT_P_INTERSPECIES_MATING;

    self.pDisjointExcessGenesRecombined = DEFAULT_P_DISJOINGEXCESSGENES_RECOMBINED;

    //----- High level mutation proportions
    self.pMutateConnectionWeights	= DEFAULT_P_MUTATE_CONNECTION_WEIGHTS;
    self.pMutateAddNode = DEFAULT_P_MUTATE_ADD_NODE;
    self.pMutateAddModule = DEFAULT_P_MUTATE_ADD_MODULE;
    self.pMutateAddConnection = DEFAULT_P_MUTATE_ADD_CONNECTION;
    self.pMutateDeleteConnection		= DEFAULT_P_MUTATE_DELETE_CONNECTION;
    self.pMutateDeleteSimpleNeuron	= DEFAULT_P_MUTATE_DELETE_SIMPLENEURON;
    self.pMutateChangeActivations = DEFAULT_P_MUTATE_CHANGE_ACTIVATIONS;
    self.pNodeMutateActivationRate = DEFAULT_N_MUTATE_ACTIVATION;

    //----- Build a default ConnectionMutationParameterGroupList.
    self.connectionMutationParameterGroupList = [];

    self.connectionMutationParameterGroupList.push(new NeatParameters.ConnectionMutationParameterGroup(0.125, NeatParameters.ConnectionPerturbationType.jiggleEven,
        NeatParameters.ConnectionSelectionType.proportional, 0.5, 0, 0.05, 0.0));

    self.connectionMutationParameterGroupList.push(new NeatParameters.ConnectionMutationParameterGroup(0.5, NeatParameters.ConnectionPerturbationType.jiggleEven,
        NeatParameters.ConnectionSelectionType.proportional, 0.1, 0, 0.05, 0.0));

    self.connectionMutationParameterGroupList.push(new NeatParameters.ConnectionMutationParameterGroup(0.125, NeatParameters.ConnectionPerturbationType.jiggleEven,
        NeatParameters.ConnectionSelectionType.fixedQuantity, 0.0, 1, 0.05, 0.0));

    self.connectionMutationParameterGroupList.push(new NeatParameters.ConnectionMutationParameterGroup(0.125, NeatParameters.ConnectionPerturbationType.reset,
        NeatParameters.ConnectionSelectionType.proportional, 0.1, 0, 0.0, 0.0));

    self.connectionMutationParameterGroupList.push(new NeatParameters.ConnectionMutationParameterGroup(0.125, NeatParameters.ConnectionPerturbationType.reset,
        NeatParameters.ConnectionSelectionType.fixedQuantity, 0.0, 1, 0.0, 0.0));

    //-----
    self.compatibilityThreshold = DEFAULT_COMPATIBILITY_THRESHOLD;
    self.compatibilityDisjointCoeff = DEFAULT_COMPATIBILITY_DISJOINT_COEFF;
    self.compatibilityExcessCoeff = DEFAULT_COMPATIBILITY_EXCESS_COEFF;
    self.compatibilityWeightDeltaCoeff = DEFAULT_COMPATIBILITY_WEIGHTDELTA_COEFF;

    self.elitismProportion = DEFAULT_ELITISM_PROPORTION;
    self.selectionProportion = DEFAULT_SELECTION_PROPORTION;

    self.targetSpeciesCountMin = DEFAULT_TARGET_SPECIES_COUNT_MIN;
    self.targetSpeciesCountMax = DEFAULT_TARGET_SPECIES_COUNT_MAX;

    self.pruningPhaseBeginComplexityThreshold = DEFAULT_PRUNINGPHASE_BEGIN_COMPLEXITY_THRESHOLD;
    self.pruningPhaseBeginFitnessStagnationThreshold = DEFAULT_PRUNINGPHASE_BEGIN_FITNESS_STAGNATION_THRESHOLD;
    self.pruningPhaseEndComplexityStagnationThreshold = DEFAULT_PRUNINGPHASE_END_COMPLEXITY_STAGNATION_THRESHOLD;

    self.speciesDropoffAge = DEFAULT_SPECIES_DROPOFF_AGE;

    self.connectionWeightRange = DEFAULT_CONNECTION_WEIGHT_RANGE;

    //DAVID
    self.activationProbabilities = [];//new double[4];
    self.activationProbabilities.push(DEFAULT_ACTIVATION_PROBABILITY);
    self.activationProbabilities.push(0);
    self.activationProbabilities.push(0);
    self.activationProbabilities.push(0);
};

NeatParameters.Copy = function(copyFrom)
{
    var self = new NeatParameters();

    //paul - joel originally
    self.noveltySearch = copyFrom.noveltySearch;
    self.noveltyHistogram = copyFrom.noveltyHistogram;
    self.noveltyFixed = copyFrom.noveltyFixed;
    self.noveltyFloat = copyFrom.noveltyFloat;
    self.histogramBins = copyFrom.histogramBins;


    self.allowSelfConnections = copyFrom.allowSelfConnections;

    self.populationSize = copyFrom.populationSize;

    self.pOffspringAsexual = copyFrom.pOffspringAsexual;
    self.pOffspringSexual = copyFrom.pOffspringSexual;
    self.pInterspeciesMating = copyFrom.pInterspeciesMating;

    self.pDisjointExcessGenesRecombined = copyFrom.pDisjointExcessGenesRecombined;

    self.pMutateConnectionWeights = copyFrom.pMutateConnectionWeights;
    self.pMutateAddNode = copyFrom.pMutateAddNode;
    self.pMutateAddModule = copyFrom.pMutateAddModule;
    self.pMutateAddConnection = copyFrom.pMutateAddConnection;
    self.pMutateDeleteConnection = copyFrom.pMutateDeleteConnection;
    self.pMutateDeleteSimpleNeuron = copyFrom.pMutateDeleteSimpleNeuron;

    // Copy the list.
    self.connectionMutationParameterGroupList = [];
    copyFrom.connectionMutationParameterGroupList.forEach(function(c){
        self.connectionMutationParameterGroupList.push(NeatParameters.ConnectionMutationParameterGroup.Copy(c));

    });

    self.compatibilityThreshold = copyFrom.compatibilityThreshold;
    self.compatibilityDisjointCoeff = copyFrom.compatibilityDisjointCoeff;
    self.compatibilityExcessCoeff = copyFrom.compatibilityExcessCoeff;
    self.compatibilityWeightDeltaCoeff = copyFrom.compatibilityWeightDeltaCoeff;

    self.elitismProportion = copyFrom.elitismProportion;
    self.selectionProportion = copyFrom.selectionProportion;

    self.targetSpeciesCountMin = copyFrom.targetSpeciesCountMin;
    self.targetSpeciesCountMax = copyFrom.targetSpeciesCountMax;

    self.pruningPhaseBeginComplexityThreshold = copyFrom.pruningPhaseBeginComplexityThreshold;
    self.pruningPhaseBeginFitnessStagnationThreshold = copyFrom.pruningPhaseBeginFitnessStagnationThreshold;
    self.pruningPhaseEndComplexityStagnationThreshold = copyFrom.pruningPhaseEndComplexityStagnationThreshold;

    self.speciesDropoffAge = copyFrom.speciesDropoffAge;

    self.connectionWeightRange = copyFrom.connectionWeightRange;

    return self;
};



});

require.register("neatjs/types/nodeType.js", function (exports, module) {
var NodeType =
{
    bias : "Bias",
    input: "Input",
    output: "Output",
    hidden: "Hidden",
    other : "Other"
};

module.exports = NodeType;
});

require.register("neatjs/utility/genomeSharpToJS.js", function (exports, module) {
//Convert between C# SharpNEAT Genotype encoded in XML into a JS genotype in JSON
//pretty simple

/**
 * Module dependencies.
 */

var NeatGenome = require('neatjs/genome/neatGenome.js');
var NeatNode = require('neatjs/genome/neatNode.js');
var NeatConnection = require('neatjs/genome/neatConnection.js');
var NodeType = require('neatjs/types/nodeType.js');


/**
 * Expose `GenomeConverter`.
 */

var converter = {};

//we export the convert object, with two functions
module.exports = converter;

converter.NeuronTypeToNodeType = function(type)
{
    switch(type)
    {
        case "bias":
            return NodeType.bias;
        case "in":
            return NodeType.input;
        case "out":
            return NodeType.output;
        case "hid":
            return NodeType.hidden;
        default:
            throw new Error("inpropper C# neuron type detected");
    }
};

converter.ConvertCSharpToJS = function(xmlGenome)
{

    //we need to parse through a c# version of genome, and make a js genome from it

    var aNeurons = xmlGenome['neurons']['neuron'] || xmlGenome['neurons'];
    var aConnections = xmlGenome['connections']['connection'] || xmlGenome['connections'];


    //we will use nodes and connections to make our genome
    var nodes = [], connections = [];
    var inCount = 0, outCount = 0;

    for(var i=0; i < aNeurons.length; i++)
    {
        var csNeuron = aNeurons[i];
        var jsNode = new NeatNode(csNeuron.id, csNeuron.activationFunction, csNeuron.layer, {type: converter.NeuronTypeToNodeType(csNeuron.type)});
        nodes.push(jsNode);

        if(csNeuron.type == 'in') inCount++;
        else if(csNeuron.type == 'out') outCount++;
    }

    for(var i=0; i < aConnections.length; i++)
    {
        var csConnection = aConnections[i];
        var jsConnection = new NeatConnection(csConnection['innov-id'], csConnection.weight, {sourceID:csConnection['src-id'], targetID: csConnection['tgt-id']});
        connections.push(jsConnection);
    }

    var ng = new NeatGenome(xmlGenome['id'], nodes, connections, inCount, outCount);
    ng.adaptable = (xmlGenome['adaptable'] == 'True');
    ng.modulated = (xmlGenome['modulated'] == 'True');
    ng.fitness = xmlGenome['fitness'];
    ng.realFitness = xmlGenome['realfitness'];
    ng.age = xmlGenome['age'];

    return ng;
};

});

require("neatjs");
